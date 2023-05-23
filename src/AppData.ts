import {
  RequireOnCreate,
  defineAppDataStructure,
  many,
  obj,
  one,
  prim,
} from "./Mufasa";

export type ClientId = `${number}` | ``;
// export type Client = (typeof mufasaTypes)["Client"];
export type Client = (typeof mufasaTypes)["Client"];
const a = {} as Client;
a.clientId;
// export type TankShape = typeof mufasaTypes["TankShape"];
// const tankShape = {
//   none: 0,
//   horizontalCylinder: 6,
//   verticalCylinder: 1,
//   oval: 2,
//   rectangle: 3,
//   ellipse: 4,
//   truckBedTank: 5,
// } as const;
// export type Tank = DocFromObj<typeof tankModel>;
export type FuelType = (typeof mufasaTypes)["FuelType"];
// export type FuelType = (typeof mufasaTypes)["fuelTypes"];
const b = {} as FuelType;
b.isVisible;

// App Data Structure
export const { getAppData, mufasaTypes } = defineAppDataStructure(`firestore`, {
  clients: many(
    obj({
      typeName: `Client`,
      props: {
        name: prim<string, RequireOnCreate>(undefined),
        clientId: prim<number | null>(null),
        phoneNumber: prim<string>(``),
        address: prim<string>(``),
        notes: prim<string>(``),
        // fuelType: one(`FuelType`),
        // tanks: obj({
        //   typeName: `FuelType`,
        //   props: {
        //     // fuelType: one<FuelType | null>(undefined),
        //     shape: prim<TankShape>(tankShape.none),
        //     length: prim<number>(0),
        //     depth: prim<number>(0),
        //     height: prim<number>(0),
        //     shortHeight: prim<number>(0),
        //   },
        // });
      },
    } as const),
  ),
  fuelTypes: many(
    obj({
      typeName: `FuelType`,
      props: {
        name: prim<string>(undefined),
        rate: prim<number | null>(null),
        isVisible: prim<boolean>(false),
        createdPosix: prim<number>(() => Date.now()),
      },
    } as const),
  ),
});
