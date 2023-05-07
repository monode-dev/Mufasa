import { defineStore } from "pinia";
import { reactive } from "vue";

interface Obj {
  _objId: string;
}

export type Client = Obj & {
  name: string;
} & typeof defaultClient;
export const defaultClient = {
  clientId: "",
  phoneNumber: "",
  address: "",
  tanks: [] as Tank[],
  plannedDeliveries: [] as Delivery[],
  deliveryRecords: [] as Delivery[],
  notes: "",
  archived: false,
  archiveDate: undefined as Date | undefined,
};

export interface Tank {
  _objId: string;
  clientId: string;
  tankShape: string;
  dimensions: string;
}

export interface Delivery {
  _objId: string;
  clientId: string;
  fuelType: string;
  amount: number;
  date: Date;
  dayOfWeek: number;
}

export interface User {
  _objId: string;
  username: string;
  password: string;
  email: string;
  clients: Client[];
  devices: Device[];
  accountCreationDate: Date;
  localData: boolean;
}

export interface Device {
  _objId: string;
  userId: string;
  deviceName: string;
  deviceType: string;
  lastAddedDate: Date;
}

function makeObjGenerator<T extends Obj, Defaults extends Partial<T>>(
  defaults: Defaults,
) {
  type ConstructorParams = Omit<T, keyof Defaults> & Partial<T>;
  function _generateObjId() {
    return Math.random().toString(36);
  }
  return function (obj: Omit<ConstructorParams, "_objId">): T {
    return {
      _objId: _generateObjId(),
      ...defaults,
      ...obj,
    } as any;
  };
}

export const useModel = defineStore("app", () => {
  return {
    clients: reactive<Client[]>([]),
    createClient: makeObjGenerator<Client, typeof defaultClient>(defaultClient),
    tanks: reactive<Tank[]>([]),
    createTank: makeObjGenerator<Tank, {}>({}),
    deliveries: reactive<Delivery[]>([]),
    createDelivery: makeObjGenerator<Delivery, {}>({}),
    users: reactive<User[]>([]),
    createUser: makeObjGenerator<User, {}>({}),
    devices: reactive<Device[]>([]),
    createDevice: makeObjGenerator<Device, {}>({}),
  };
});
