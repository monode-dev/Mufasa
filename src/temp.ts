import { defineStore } from 'pinia';
import {
  initializeApp,
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { ref } from 'vue';

// Type Definitions

type RequireOnCreate = true;

type PrimitiveType = boolean | number | string;

type ObjectType<T extends object> = T & {
  _firestoreRef: ReturnType<typeof doc>;
  isLoaded: boolean;
  isDeleted: boolean;
  delete: () => Promise<void>;
};

type Doc<T extends object> = ObjectType<T> & {
  id: string;
};

type OneToOne<T extends object | null> = T extends null ? null : ObjectType<T>;

type OneToMany<T extends object, CreateArgs extends any[]> = ObjectType<T> & {
  parent: ObjectType<any>;
  add: (...args: CreateArgs) => Promise<Doc<T>>;
};

type List<T extends Doc<{}>, CreateArgs extends any[]> = Iterable<T> & {
  readonly length: number;
  filter(filterFn: (doc: T) => boolean): List<T, CreateArgs>;
  map<R>(mapFn: (doc: T) => R): Array<R>;
  add(...args: CreateArgs): Promise<Doc<T>>;
};

type PrimitiveProp<T extends PrimitiveType, R extends boolean> = {
  (): T;
  (value: T): void;
  (value?: R): T | R;
};

type ObjectProp<T extends object | null> = {
  (): T;
  (value: T): void;
};

type OneToOneProp<T extends object | null> = {
  (): OneToOne<T>;
  (value: OneToOne<T>): void;
};

type OneToManyProp<T extends object, CreateArgs extends any[]> = {
  (): List<T, CreateArgs>;
  (value: List<T, CreateArgs>): void;
};

type PropType<T> = T extends PrimitiveType
  ? PrimitiveProp<T, true>
  : T extends object | null
  ? ObjectProp<T>
  : T extends OneToOne<infer U>
  ? OneToOneProp<U>
  : T extends List<infer U, infer Args>
  ? OneToManyProp<U, Args>
  : never;

type ObjectModel<T extends object> = {
  [K in keyof T]: PropType<T[K]>;
};

type ObjectModelFactory = {
  obj<T extends object>(model: ObjectModel<T>): ObjectModel<T>;
  many<T extends object, CreateArgs extends any[]>(
    model: ObjectModel<T>,
  ): List<T, CreateArgs>;
  one<T extends object>(
    typeName: string,
    defaultValue: T | null,
  ): OneToOne<T>;
  prim<T extends PrimitiveType, R extends boolean = true>(
    defaultValue?: T | R,
  ): PrimitiveProp<T, R>;
};

// Firebase Configuration
const firebaseConfig = {
  // Add your Firebase configuration here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper Functions
function createObject<T extends object>(
  typeName: string,
  props: ObjectModel<T>,
  parent?: ObjectType<any>,
): ObjectType<T> {
  const obj: any = {};
  obj._firestoreRef = null;
  obj.isLoaded = false;
  obj.isDeleted = false;
  obj.delete = async () => {
    if (obj._firestoreRef) {
      await deleteDoc(obj._firestoreRef);
      obj.isDeleted = true;
      obj._firestoreRef = null;
      if (parent) {
        parent[parentPropertySymbol(typeName)].delete(obj);
      }
    }
  };

  const propertySymbols = Object.keys(props).reduce(
    (symbols, prop) => ({
      ...symbols,
      [prop]: Symbol(prop),
    }),
    {},
  );

  for (const prop in props) {
    const propValue = props[prop];

    if (typeof propValue === 'function') {
      Object.defineProperty(obj, prop, {
        get() {
          return propValue();
        },
        set(value) {
          propValue(value);
          if (obj._firestoreRef) {
            setDoc(obj._firestoreRef, { [prop]: value }, { merge: true });
          }
        },
      });
    } else if (isObjectModelFactory(propValue)) {
      Object.defineProperty(obj, prop, {
        get() {
          if (propValue === oneToManyFactory) {
            if (!obj[propertySymbols[prop]]) {
              obj[propertySymbols[prop]] = createList(
                propValue,
                obj,
                typeName,
                prop,
              );
            }
            return obj[propertySymbols[prop]];
          }

          if (!obj[propertySymbols[prop]]) {
            obj[propertySymbols[prop]] = createObject(
              propValue.typeName,
              propValue.props,
              obj,
            );
          }
          return obj[propertySymbols[prop]];
        },
        set(value) {
          if (value === null) {
            if (obj[propertySymbols[prop]]) {
              obj[propertySymbols[prop]].delete();
              obj[propertySymbols[prop]] = null;
            }
          } else if (isObject(value) && !value.isDeleted) {
            obj[propertySymbols[prop]] = value;
          } else {
            console.error(
              `Invalid value for property '${prop}': ${JSON.stringify(value)}`,
            );
          }
        },
      });
    }
  }

  if (parent) {
    obj._firestoreRef = doc(collection(db, typeName));
    parent[parentPropertySymbol(typeName)].add(obj);
  }

  return obj;
}

function createList<T extends object, CreateArgs extends any[]>(
  model: ObjectModel<T>,
  parent: ObjectType<any>,
  parentTypeName: string,
  propName: string,
): List<T, CreateArgs> {
  const list: any[] = [];
  const symbol = Symbol(propName);

  function add(...args: CreateArgs): Promise<Doc<T>> {
    const newObject = createObject(model.typeName, model.props, parent);
    list.push(newObject);
    return addDoc(collection(db, model.typeName), { ...args[0], ...newObject });
  }

  Object.defineProperty(list, 'length', {
    get() {
      return list.filter((item) => !item.isDeleted).length;
    },
  });

  Object.defineProperty(list, 'filter', {
    value: function (filterFn: (doc: ObjectType<T>) => boolean) {
      const newList = createList(model, parent, parentTypeName, propName);
      list.forEach((item) => {
        if (!item.isDeleted && filterFn(item)) {
          newList.add(item);
        }
      });
      return newList;
    },
  });

  Object.defineProperty(list, 'map', {
    value: function <R>(mapFn: (doc: ObjectType<T>) => R) {
      const mappedList: R[] = [];
      list.forEach((item) => {
        if (!item.isDeleted) {
          mappedList.push(mapFn(item));
        }
      });
      return mappedList;
    },
  });

  Object.defineProperty(list, 'add', {
    value: add,
  });

  Object.defineProperty(parent, symbol, {
    value: list,
  });

  return list;
}

function parentPropertySymbol(typeName: string) {
  return Symbol(`parent_${typeName}`);
}

function isObjectModelFactory(value: any): value is ObjectModelFactory {
  return (
    typeof value === 'object' &&
    value !== null &&
    'obj' in value &&
    'many' in value &&
    'one' in value &&
    'prim' in value
  );
}

const oneToManyFactory = { typeName: '', props: {} } as const;

function many<T extends object, CreateArgs extends any[]>(
  model: ObjectModel<T>,
): List<T, CreateArgs> {
  return oneToManyFactory as List<T, CreateArgs>;
}

function one<T extends object>(
  typeName: string,
  defaultValue: T | null,
): OneToOne<T> {
  return defaultValue as OneToOne<T>;
}

function prim<T extends PrimitiveType, R extends boolean = true>(
  defaultValue?: T | R,
): PrimitiveProp<T, R> {
  const valueRef = ref(defaultValue);

  function getter(value?: T | R) {
    if (value !== undefined) {
      valueRef.value = value;
    }
    return valueRef.value;
  }

  getter.valueRef = valueRef;

  return getter;
}

function obj<T extends object>(model: ObjectModel<T>): ObjectModel<T> {
  return model;
}

export function defineAppDataStructure(
  storeName: string,
  structure: {
    [key: string]: ObjectModel<{}>;
  },
) {
  const store = defineStore(storeName, () => {
    const data: any = {};
    for (const key in structure) {
      data[key] = many(structure[key]);
    }
    return data;
  });

  const appTypes = {} as {
    [K in keyof typeof store['$state']]: typeof store['$state'][K] extends List<
      infer T,
      infer Args
    >
      ? List<Doc<T>, Args>
      : typeof store['$state'][K] extends OneToOne<infer U>
      ? ObjectType<U>
      : typeof store['$state'][K] extends ObjectType<infer U>
      ? ObjectType<Doc<U>>
      : ReturnType<typeof store['$state'][K]['valueRef']>;
  };

  const useAppData = () => {
    const storeInstance = store();
    const appData = {} as typeof appTypes;

    for (const key in structure) {
      if (Array.isArray(storeInstance[key])) {
        const list: any[] = [];
        storeInstance[key].forEach((item: any) => {
          if (!item.isDeleted) {
            list.push({
              ...item,
              id: item._firestoreRef.id,
            });
          }
        });
        appData[key] = list;
      } else {
        appData[key] = storeInstance[key];
      }
    }

    return appData;
  };

  return { useAppData, appTypes };
}