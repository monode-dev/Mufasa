import { Doc, List, defineAppDataStructure } from "./mufasa/Implement";
import { defObj, defMany, defOne, defPrim } from "./mufasa/Define";
import { exists, orderDocs } from "./utils";
import { TankShapeId, getTankShape } from "./views/calculators/ShapeUtils";
import { FormatToTsType, ObjToFormat } from "./mufasa/Parse";

export type ClientId = `${number}` | ``;
export type Client = (typeof mufasaTypes)["Client"];
export function getClientLabel(client: Client | null | undefined): string {
  const nameExists = exists(client?.name) && client?.name !== ``;
  const clientIdExists = exists(client?.clientId);
  if (nameExists && clientIdExists) {
    return `${client?.clientId} - ${client?.name}`;
  } else if (nameExists) {
    return client?.name!;
  } else if (clientIdExists) {
    return `${client?.clientId}`;
  } else {
    return `Unnamed Client`;
  }
}
// const a = {} as Client;
// a.fuelType;
export type Tank = (typeof mufasaTypes)["Tank"];
export function getTankLabel(tank: Tank | null | undefined): string {
  // TODO: Fuel - Volume - Shape - Label
  const shapeUtils = getTankShape(tank?.shape);
  const fuelName = tank?.fuelType?.name;
  const volume = shapeUtils?.calcTotalVolume(tank);
  const shapeName = shapeUtils?.nameShort;
  if (exists(fuelName) && exists(volume) && exists(shapeName)) {
    return `${fuelName} - ${Math.round(volume)} Gal. - ${shapeName}`;
  } else {
    return `Incomplete Tank`;
  }
}
export type FuelType = (typeof mufasaTypes)["FuelType"];
export type Delivery = (typeof mufasaTypes)["Delivery"];
export type UpcomingExistingDelivery = Doc<{
  deliveryFormat: `upcomingFromExisting`;
  upcomingExistingClient: Client | null;
  upcomingExistingTank: Tank | null;
  creationTimePosix: number;
  quantity: number;
}>;
export type UpcomingOneTimeDelivery = Doc<{
  deliveryFormat: `upcomingFromOneTime`;
  upcomingOneTimeClientName: string;
  upcomingOneTimeFuelType: FuelType | null;
  creationTimePosix: number;
  quantity: number;
}>;
export type CompletedDelivery = Doc<{
  deliveryFormat: `completed`;
  completedClientLabel: string;
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
    delivery.completedClientLabel = getClientLabel(
      delivery.upcomingExistingClient,
    );
    delivery.completedFuelTypeName =
      delivery.upcomingExistingTank!.fuelType!.name!;
    delivery.completedRate = delivery.upcomingExistingTank!.fuelType!.rate!;
    delivery.completedTimePosix = Date.now();
    delivery.deliveryFormat = `completed`;
  }
  if (delivery.deliveryFormat === `upcomingFromOneTime`) {
    delivery.completedClientLabel = delivery.upcomingOneTimeClientName;
    delivery.completedFuelTypeName = delivery.upcomingOneTimeFuelType!.name!;
    delivery.completedRate = delivery.upcomingOneTimeFuelType!.rate!;
  }
}
export function listUpcomingDeliveries(allDeliveries: List<Delivery>) {
  return orderDocs(
    allDeliveries.filter((delivery) => delivery.deliveryFormat !== `completed`),
    (x) => x.creationTimePosix,
  ) as any as (UpcomingExistingDelivery | UpcomingOneTimeDelivery)[];
}
export function listCompletedDeliveries(
  allDeliveries: List<Delivery>,
): Delivery[] {
  return orderDocs(
    allDeliveries.filter((delivery) => delivery.deliveryFormat === `completed`),
    (x) => x.completedTimePosix,
  );
}

// App Data Structure
export const { getAppData, mufasaTypes } = defineAppDataStructure(
  `firestore`,
  {
    apiKey: "AIzaSyDt4S19UxISNKFacXXAQl0I2drGfStspD0",
    authDomain: "ninety-percent.firebaseapp.com",
    projectId: "ninety-percent",
    storageBucket: "ninety-percent.appspot.com",
    messagingSenderId: "341748622809",
    appId: "1:341748622809:web:a114f74a7c325fc68de5c8",
  },
  {
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
                shape: defPrim<TankShapeId | null>(null),
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
          name: defPrim<string | null>(null),
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
          completedClientLabel: defPrim<string>(``),
          completedTimePosix: defPrim<number | null>(null),
          completedFuelTypeName: defPrim<string>(``),
          completedRate: defPrim<number>(0),
        },
      } as const),
    ),
  },
);
