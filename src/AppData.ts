import { Doc, List, defineAppDataStructure } from "./mufasa/Implement";
import { defObj, defMany, defOne, defPrim } from "./mufasa/Define";
import { exists, orderDocs } from "./utils";

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
export type Delivery = (typeof mufasaTypes)["Delivery"];
export type UpcomingExistingDelivery = Doc<{
  deliveryFormat: `upcomingFromExisting`;
  upcomingExistingClient: Client | null;
  upcomingExistingTank: Tank | null;
  createdPosix: number;
  quantity: number;
}>;
export type UpcomingOneTimeDelivery = Doc<{
  deliveryFormat: `upcomingFromOneTime`;
  upcomingOneTimeClientName: string;
  upcomingOneTimeFuelType: FuelType | null;
  createdPosix: number;
  quantity: number;
}>;
export type CompletedDelivery = Doc<{
  deliveryFormat: `completed`;
  completedClient: Client | null;
  completedClientName: string;
  completedDate: number;
  completedFuelTypeName: string;
  completedRate: number;
  quantity: number;
}>;
export function canCompleteDelivery(delivery: Delivery): boolean {
  if (delivery.deliveryFormat === `completed`) return false;
  if (delivery.deliveryFormat === `upcomingFromExisting`) {
    return (
      exists(delivery.upcomingExistingClient) &&
      exists(delivery.upcomingExistingTank) &&
      exists(delivery.upcomingExistingTank?.fuelType) &&
      exists(delivery.upcomingExistingTank?.fuelType?.rate)
    );
  }
  if (delivery.deliveryFormat === `upcomingFromOneTime`) {
    return (
      exists(delivery.upcomingOneTimeFuelType) &&
      exists(delivery.upcomingOneTimeFuelType?.rate)
    );
  }
  return false;
}
export function completeDelivery(delivery: Delivery): void {
  if (!canCompleteDelivery(delivery)) return;
  if (delivery.deliveryFormat === `upcomingFromExisting`) {
    delivery.completedClient = delivery.upcomingExistingClient;
    delivery.completedClientName = delivery.completedClient!.name;
    delivery.completedFuelTypeName =
      delivery.upcomingExistingTank!.fuelType!.name;
    delivery.completedRate = delivery.upcomingExistingTank!.fuelType!.rate;
  }
  if (delivery.deliveryFormat === `upcomingFromOneTime`) {
    delivery.completedClientName = delivery.upcomingOneTimeClientName;
    delivery.completedFuelTypeName = delivery.upcomingOneTimeFuelType!.name;
    delivery.completedRate = delivery.upcomingOneTimeFuelType!.rate;
  }
}
export function listUpcomingDeliveries(allDeliveries: List<Delivery>) {
  return orderDocs(
    allDeliveries.filter((delivery) => delivery.deliveryFormat !== `completed`),
    (x) => x.creationTimePosix,
  ) as any as (UpcomingExistingDelivery | UpcomingOneTimeDelivery)[];
}
export function listCompletedDeliveries(allDeliveries: List<Delivery>) {
  return orderDocs(
    allDeliveries.filter((delivery) => delivery.deliveryFormat === `completed`),
    (x) => x.completedTimePosix,
  ) as any as CompletedDelivery[];
}

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
              // Maybe record x, y, and z instead.
              length: defPrim<number>(0),
              depth: defPrim<number>(0),
              height: defPrim<number>(0),
              shortHeight: defPrim<number>(0),
              creationTimePosix: defPrim<number>(() => Date.now()),
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
  deliveries: defMany(
    defObj({
      typeName: `Delivery`,
      props: {
        deliveryFormat: defPrim<
          `completed` | `upcomingFromExisting` | `upcomingFromOneTime`
        >(`upcomingFromExisting`),
        creationTimePosix: defPrim<number>(() => Date.now()),
        quantity: defPrim<number>(0),

        // Upcoming from existing client
        upcomingExistingClient: defOne(`Client`, null),
        upcomingExistingTank: defOne(`Tank`, null),

        // Upcoming from one-time client
        upcomingOneTimeClientName: defPrim<string>(``),
        upcomingOneTimeFuelType: defOne(`FuelType`, null),

        // Completed
        completedClient: defOne(`Client`, null),
        completedClientName: defPrim<string>(``),
        completedTimePosix: defPrim<number>(-1),
        completedFuelTypeName: defPrim<string>(``),
        completedRate: defPrim<number>(0),
      },
    } as const),
  ),
});
