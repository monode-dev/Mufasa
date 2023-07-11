import { Doc, List, defineAppDataStructure } from "./mufasa/Implement";
import { defObj, defMany, defOne, defPrim } from "./mufasa/Define";
import { exists, roundToString, orderDocs, formatNumWithCommas } from "./utils";
import { TankShapeId, getTankShape } from "@/views/tanks/ShapeUtils";
import { computed, isRef, ref, watchEffect } from "vue";

export type Client = (typeof mufasaTypes)["Client"];
export function isClientValid(
  client: Partial<Client> | null | undefined,
): boolean {
  const clientIdExists =
    exists(client?.clientId) && client?.clientId.trim() !== ``;
  const nameExists = exists(client?.name) && client?.name.trim() !== ``;
  return clientIdExists || nameExists;
}
export function getClientLabel(client: Client | null | undefined): string {
  if (!isClientValid(client)) return `Unnamed Client`;
  const nameExists = exists(client?.name) && client?.name?.trim() !== ``;
  const clientIdExists =
    exists(client?.clientId) && client?.clientId?.trim() !== ``;
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
export function listClients(
  clients: List<Client>,
  excludeInvalidClients: boolean = false,
): Client[] {
  let result = orderDocs(clients, (x) => {
    const name = x?.name?.trim().toLowerCase();
    const nameExists = exists(name) && name !== ``;
    const clientId = x?.clientId?.trim().toLowerCase();
    const clientIdExists = exists(clientId) && clientId !== ``;
    let sortName = name ?? ``;
    if (nameExists && clientIdExists) {
      sortName += ` - `;
    }
    sortName += clientId ?? ``;
    return sortName;
  });

  if (excludeInvalidClients) {
    result = result.filter(isClientValid);
  }

  return result;
}

// const a = {} as Client;
// a.fuelType;
export type Tank = (typeof mufasaTypes)["Tank"];
export function isTankValid(tank: Partial<Tank> | null | undefined): boolean {
  const shapeUtils = getTankShape(tank?.shape);
  const volume = shapeUtils?.calcTotalVolume(tank);
  return (
    isFuelTypeValid(tank?.fuelType) &&
    exists(shapeUtils?.nameShort) &&
    exists(volume) &&
    volume > 0
  );
}
export function getTankLabel(tank: Partial<Tank> | null | undefined): string {
  if (!isTankValid(tank)) return `Incomplete Tank`;
  const shapeUtils = getTankShape(tank?.shape);
  const fuelName = tank?.fuelType?.name;
  const volume = shapeUtils?.calcTotalVolume(tank);
  const shapeName = shapeUtils?.nameShort;
  return `${fuelName} - ${formatNumWithCommas(volume!)} Gal. - ${shapeName}${
    exists(tank?.optionalLabel) && tank?.optionalLabel?.trim() !== ``
      ? ` - ${tank?.optionalLabel}`
      : ``
  }`;
}
export function listTanks(
  tanks: List<Tank> | undefined,
  excludeInvalidTanks: boolean = false,
): Tank[] {
  let result = orderDocs(tanks ?? [], (x) => x.creationTimePosix);

  if (excludeInvalidTanks) {
    result = result.filter(isTankValid);
  }

  return result;
}

// Fuel Type
export type FuelType = (typeof mufasaTypes)["FuelType"];
export function isFuelTypeValid(
  fuelType: Partial<FuelType> | null | undefined,
) {
  return (
    exists(fuelType?.name) &&
    exists(fuelType?.rate) &&
    fuelType?.rate! > 0 &&
    fuelType?.name?.trim() !== ``
  );
}
export function listFuelTypes(
  fuelTypes: List<FuelType> | undefined,
  excludeInvalidFuelTypes: boolean = false,
): FuelType[] {
  let result = orderDocs(fuelTypes ?? [], (x) => x.createdPosix, {
    // direction: `reverse`,
  });
  if (excludeInvalidFuelTypes) {
    result = result.filter(isFuelTypeValid);
  }
  return result;
}

export type Delivery = (typeof mufasaTypes)["Delivery"];
export type DeliveryFormat = Delivery["deliveryFormat"];
export const deliveryFormats = {
  upcomingFromExisting: `upcomingFromExisting`,
  upcomingFromOneTime: `upcomingFromOneTime`,
  completed: `completed`,
} satisfies {
  [key in Exclude<DeliveryFormat, null | undefined>]: DeliveryFormat;
};
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
    return exists(delivery.fuelType) && exists(delivery.fuelType?.rate);
  }
  return false;
}
export function completeDelivery(delivery: Delivery): void {
  if (!canCompleteDelivery(delivery)) return;
  if (delivery.deliveryFormat === `upcomingFromExisting`) {
    delivery.deliveryLabel = getClientLabel(delivery.upcomingExistingClient);
    delivery.completedFuelTypeName =
      delivery.upcomingExistingTank!.fuelType!.name!;
    delivery.completedRate = delivery.upcomingExistingTank!.fuelType!.rate!;
  }
  if (delivery.deliveryFormat === `upcomingFromOneTime`) {
    delivery.completedFuelTypeName = delivery.fuelType!.name!;
    delivery.completedRate = delivery.fuelType!.rate!;
  }
  delivery.completedTimePosix = Date.now();
  delivery.deliveryFormat = `completed`;
}
export function listUpcomingDeliveries(allDeliveries: List<Delivery>) {
  return orderDocs(
    allDeliveries.filter((delivery) => delivery.deliveryFormat !== `completed`),
    (x) => x.creationTimePosix,
  ) as any as Delivery[];
}
export function isUpcomingDeliveryValid(
  delivery: Partial<Delivery> | null | undefined,
): boolean {
  return (
    exists(delivery) &&
    exists(delivery?.deliveryFormat) &&
    exists(delivery.quantity) &&
    delivery.quantity > 0 &&
    ((delivery?.deliveryFormat === `upcomingFromExisting` &&
      exists(delivery.upcomingExistingClient) &&
      exists(delivery.upcomingExistingTank) &&
      // A simple way to make sure something important hasn't been deleted
      isTankValid(delivery.upcomingExistingTank)) ||
      (delivery?.deliveryFormat === `upcomingFromOneTime` &&
        exists(delivery.fuelType) &&
        isFuelTypeValid(delivery.fuelType)))
  );
}
export function listCompletedDeliveries(
  allDeliveries: List<Delivery>,
): Delivery[] {
  return orderDocs(
    allDeliveries.filter((delivery) => delivery.deliveryFormat === `completed`),
    (x) => x.completedTimePosix,
    { direction: `reverse` },
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
    computed: computed,
    signal: ref,
    isSignal: isRef,
    watchEffect: watchEffect,
  },
  {
    clients: defMany(
      defObj({
        typeName: `Client`,
        props: {
          name: defPrim<string>(``),
          clientId: defPrim<string>(``),
          phoneNumber: defPrim<string>(``),
          address: defPrim<string>(``),
          notes: defPrim<string>(``),
          tanks: defMany(
            defObj({
              typeName: `Tank`,
              props: {
                optionalLabel: defPrim<string>(``),
                fuelType: defOne(`FuelType`, null),
                shape: defPrim<TankShapeId | null>(null),
                // Maybe record x, y, and z instead.
                length: defPrim<number | null>(null),
                depth: defPrim<number | null>(null),
                topDepth: defPrim<number | null>(null),
                fullDepth: defPrim<number | null>(null),
                height: defPrim<number | null>(null),
                squareHeight: defPrim<number | null>(null),
                wideHeight: defPrim<number | null>(null),
                fullHeight: defPrim<number | null>(null),
                diameter: defPrim<number | null>(null),
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
          fuelType: defOne(`FuelType`, null),

          // Completed
          deliveryLabel: defPrim<string>(``),
          completedTimePosix: defPrim<number | null>(null),
          completedFuelTypeName: defPrim<string>(``),
          completedRate: defPrim<number>(0),
        },
      } as const),
    ),
  },
);
