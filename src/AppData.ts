import { UnionToIntersection } from "firebase/firestore";
import { defineAppDataStructure } from "./mufasa/Implement";
import { defObj, defMany, defOne, defPrim } from "./mufasa/Define";

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
export const { getAppData, mufasaTypes } = defineAppDataStructure(`firestore`, {
  clients: defMany(
    defObj({
      typeName: `Client`,
      props: {
        name: defPrim<string>(``),
        clientId: defPrim<number | null>(null),
        phoneNumber: defPrim<string>(``),
        address: defPrim<string>(``),
        notes: defPrim<string>(``),
        fuelType: defOne(`FuelType`, null),
        tanks: defMany(
          defObj({
            typeName: `Tank`,
            props: {
              fuelType: defOne(`FuelType`, null),
              shape: defPrim<TankShape>(tankShape.none),
              length: defPrim<number>(0),
              depth: defPrim<number>(0),
              height: defPrim<number>(0),
              shortHeight: defPrim<number>(0),
            },
          } as const),
        ),
      },
    } as const),
  ),
  fuelTypes: defMany(
    defObj({
      typeName: `FuelType`,
      props: {
        name: defPrim<string>(undefined),
        rate: defPrim<number | null>(null),
        isVisible: defPrim<boolean>(false),
        createdPosix: defPrim<number>(() => Date.now()),
      },
    } as const),
  ),
});
