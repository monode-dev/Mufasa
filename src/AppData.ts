import { defineAppDataStructure } from "./mufasa/Implement";
import { defObj, defMany, defOne, defPrim } from "./mufasa/Define";

export type ClientId = `${number}` | ``;
export type Client = (typeof mufasaTypes)["Client"];
// const a = {} as Client;
// a.fuelType;
export type TankShape = (typeof tankShape)[keyof typeof tankShape];
export const tankShape = {
  none: 0,
  horizontalCylinder: 1,
  verticalCylinder: 2,
  oval: 3,
  rectangle: 4,
  ellipse: 5,
  truckBedTank: 6,
} as const;
export function getTankShapeName(shape: TankShape) {
  return {
    [tankShape.none]: `None`,
    [tankShape.horizontalCylinder]: `Horizontal Cylinder`,
    [tankShape.verticalCylinder]: `Vertical Cylinder`,
    [tankShape.oval]: `Oval`,
    [tankShape.rectangle]: `Rectangle`,
    [tankShape.ellipse]: `Ellipse`,
    [tankShape.truckBedTank]: `Truck Bed Tank`,
  }[shape];
}
export type Tank = (typeof mufasaTypes)["Tank"];
export type FuelType = (typeof mufasaTypes)["FuelType"];
export type UpcomingDelivery = (typeof mufasaTypes)["UpcomingDelivery"];
export type CompletedDelivery = (typeof mufasaTypes)["CompletedDelivery"];

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
        createdPosix: defPrim<number>(() => Date.now()),
      },
    } as const),
  ),
  upcomingDeliveries: defMany(
    defObj({
      typeName: `UpcomingDelivery`,
      props: {
        clientName: defPrim<string>(``),
        tankName: defPrim<string>(``),
        fuelType: defOne(`FuelType`, null),
        amount: defPrim<number>(0),
      },
    } as const),
  ),
  completedDeliveries: defMany(
    defObj({
      typeName: `CompletedDelivery`,
      props: {
        clientName: defPrim<string>(``),
        tankName: defPrim<string>(``),
        fuelTypeName: defPrim<string>(``),
        rate: defPrim<number>(0),
        amount: defPrim<number>(0),
        completedDate: defPrim<number>(0),
      },
    } as const),
  ),
});
