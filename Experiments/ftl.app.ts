import { createMutable } from "solid-js/store";

const ftl = {
  cloud: (json: any) => json,
  app: (json: any) => ({
    savedData: (data: {
      [key: string]: any; //string | number | boolean | null | undefined;
    }) => data,
    function: (fn: (...args: any[]) => any) => fn,
  }),
  function: (fn: (...args: any[]) => any) => fn,
  // The benefits of using a class probably out weight the downsides.
  schema: <
    Name extends string,
    PropSchemas extends {
      [key: string]: FtlSchemaPropValue; //string | number | boolean | null | undefined;
    },
  >(
    name: Name,
    getPropsSchema: () => PropSchemas,
  ) => {
    type WritablePropKeys = Exclude<keyof PropSchemas, `_${string}`>;
    type ReadonlyPropKeys = Exclude<keyof PropSchemas, WritablePropKeys>;
    type Props = {
      [Key in keyof PropSchemas]: PropSchemas[Key] extends _FtlType
        ? PropSchemas[Key][`$type`]
        : PropSchemas[Key] extends _FtlType[]
        ? PropSchemas[Key][number][`$type`][]
        : PropSchemas[Key];
    };
    return {
      $type: {} as {
        readonly $ftlMetadata: {
          // On assignment scopes are updated.
          // Scopes have a broadness level: session-1, app-2, cloud-3
          // Scopes should be other ftl objects.
          readonly references: []; // Use to be called scopes
        };
      } & {
        [Key in WritablePropKeys]: Props[Key];
      } & {
        readonly [Key in ReadonlyPropKeys]: Props[Key];
      },
      $isFtlType: true as true,
      typeName: name,
      create: (initProps: {
        [Key in keyof Props]: Props[Key];
      }) => {
        return createMutable(initProps);
      },
    } satisfies FtlSchema;
  },
};
type FtlSchema = {
  $type: {
    readonly $ftlMetadata: {
      readonly references: [];
    };
  } & {
    [key: string]: any;
  };
  $isFtlType: true;
  typeName: string;
  create: (initProps: any) => any;
};
type FtlSchemaPropValue =
  | string
  | number
  | boolean
  | null
  | FtlType
  | _FtlType[];

// FTL Types
type FtlType = _FtlType | null;
type _FtlType = {
  $type: any;
  $isFtlType: true;
};
type Bool = typeof Bool.$type;
const Bool = {
  $type: true as boolean,
  $isFtlType: true as true,
};
type Num = typeof Num.$type;
const Num = {
  $type: 0 as number,
  $isFtlType: true as true,
};
type Str = typeof Str.$type;
const Str = {
  $type: `` as string,
  $isFtlType: true as true,
};
const or = <FirstType extends FtlType, OtherTypes extends FtlType>(
  first: FirstType,
  ...others: OtherTypes[]
) => ({
  $type: {} as
    | (FirstType extends _FtlType ? FirstType[`$type`] : FirstType)
    | (OtherTypes extends _FtlType ? OtherTypes[`$type`] : OtherTypes),
  $isFtlType: true as true,
});
// const user: User = {} as any;
// user._workspace?.clients[0].name;

const ninetyPercentCloud = ftl.cloud({
  // Firebase config goes here.
});

const ninetyPercentApp = ftl.app({
  // App listing or hosting information goes here.
  // firstPage: <HomePage />, or <PageSwitch />
});

// SECTION: User
ninetyPercentCloud.savedData({
  // These are private and not publicly accessible.
  _users: [] as User[],
});
// Should be able to use firebase auth for device storage.
const auth = ninetyPercentApp.savedData({
  // auth.user remembers that the user object is saved to the cloud, because cloud is broader than app.
  user: null as User | null,
});
// This will probably be a session only function
const signIn = (...args: any[]) => {
  // Sign in via firebase auth.
  // Create a user object that is saved to the cloud.
  // Assign the new user to auth.user.
};

type User = typeof User.$type;
const User = ftl.schema(`User`, () => ({
  // current: User | null = ninetyPercentApp.savedData(null);
  // Can be read but not set. Technically is probably `null | MemberWorkspace | AdminWorkspace`
  _workspace: or(Workspace, null),
  _joinWorkspace: ninetyPercentCloud.function((inviteId: string) => {
    // "this" could be used to reference the user inst would translated into a cloud function parameter.
  }),
  test: 0,
}));

type Workspace = typeof Workspace.$type;
const Workspace = ftl.schema(`Workspace`, () => ({
  clients: [Client],
  fuels: [Fuel],
  createInvite: ninetyPercentCloud.function(() => {
    // "this" could be used to reference the user inst would translated into a cloud function parameter.
  }),
}));

type WorkspaceInvite = typeof WorkspaceInvite.$type;
const WorkspaceInvite = ftl.schema(`WorkspaceInvite`, () => ({
  workspace: Workspace,
}));

type Fuel = typeof Fuel.$type;
const Fuel = ftl.schema(`Fuel`, () => ({
  name: Str,
}));

type Client = typeof Client.$type;
const Client = ftl.schema(`Client`, () => ({
  name: Str,
  tanks: [Tank],
}));

// A tank will be locally saved if it is indirectly referenced by auth.user which is locally saved.
// A tank will be globally saved if it is indirectly referenced by a global user.
type Tank = typeof Tank.$type;
const Tank = ftl.schema(`Tank`, () => ({
  fuel: or(Fuel, null),
  shape: or(Str, null),
}));
