import { UnionToIntersection } from "firebase/firestore";
import {
  RequireOnCreate,
  defineAppDataStructure,
  many,
  obj,
  one,
  prim,
} from "./Mufasa";

export type ClientId = `${number}` | ``;
export type Client = (typeof mufasaTypes)["Client"];
// const a = {} as Client;
// a.fuelType;
export type TankShape = (typeof tankShape)[keyof typeof tankShape];
const tankShape = {
  none: 0,
  horizontalCylinder: 6,
  verticalCylinder: 1,
  oval: 2,
  rectangle: 3,
  ellipse: 4,
  truckBedTank: 5,
} as const;
export type Tank = (typeof mufasaTypes)["Tank"];
export type FuelType = (typeof mufasaTypes)["FuelType"];

// App Data Structure
export const { getAppData, mufasaTypes, test } = defineAppDataStructure(
  `firestore`,
  {
    clients: many(
      obj({
        typeName: `Client`,
        props: {
          name: prim<string, RequireOnCreate>(undefined),
          clientId: prim<number | null>(null),
          phoneNumber: prim<string>(``),
          address: prim<string>(``),
          notes: prim<string>(``),
          fuelType: one(`FuelType`, null),
          tanks: many(
            obj({
              typeName: `Tank`,
              props: {
                fuelType: one(`FuelType`, null),
                shape: prim<TankShape>(tankShape.none),
                length: prim<number>(0),
                depth: prim<number>(0),
                height: prim<number>(0),
                shortHeight: prim<number>(0),
              },
            } as const),
          ),
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
  },
);

test.Tank;
