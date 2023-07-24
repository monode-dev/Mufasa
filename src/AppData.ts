import {
  Doc,
  List,
  defineAppDataStructure,
  listOf,
  prim,
  refTo,
} from "@monode/orm";
import { exists, roundToString, orderDocs, formatNumWithCommas } from "./utils";
import { TankShapeId, getTankShape } from "@/views/tanks/ShapeUtils";
import { computed, isRef, ref, watchEffect } from "vue";

export type Client = (typeof types)["Client"];
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
export type Tank = (typeof types)["Tank"];
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
export type FuelType = (typeof types)["FuelType"];
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

export type Delivery = (typeof types)["Delivery"];
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
export const { getAppData, types } = defineAppDataStructure(
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
    isProduction: import.meta.env.PROD,
    rootSchema: {
      clients: listOf(`Client`),
      fuelTypes: listOf(`FuelType`),
      deliveries: listOf(`Delivery`),
    },
    typeSchemas: {
      Client: {
        name: prim<string>(``),
        clientId: prim<string>(``),
        phoneNumber: prim<string>(``),
        address: prim<string>(``),
        notes: prim<string>(``),
        tanks: listOf(`Tank`),
      },
      Tank: {
        optionalLabel: prim<string>(``),
        fuelType: refTo(`FuelType`, null),
        shape: prim<TankShapeId>(null),
        // Maybe record x, y, and z instead.
        length: prim<number>(null),
        depth: prim<number>(null),
        topDepth: prim<number>(null),
        fullDepth: prim<number>(null),
        height: prim<number>(null),
        squareHeight: prim<number>(null),
        wideHeight: prim<number>(null),
        fullHeight: prim<number>(null),
        diameter: prim<number>(null),
        creationTimePosix: prim<number>(() => Date.now()),
      },
      FuelType: {
        name: prim<string>(null),
        rate: prim<number>(null),
        createdPosix: prim<number>(() => Date.now()),
      },
      Delivery: {
        deliveryFormat: prim<
          `completed` | `upcomingFromExisting` | `upcomingFromOneTime`
        >(`upcomingFromExisting`),
        creationTimePosix: prim<number>(() => Date.now()),
        quantity: prim<number>(0),

        // Upcoming from existing client
        upcomingExistingClient: refTo(`Client`, null),
        upcomingExistingTank: refTo(`Tank`, null),

        // Upcoming from one-time client
        fuelType: refTo(`FuelType`, null),

        // Completed
        deliveryLabel: prim<string>(``),
        completedTimePosix: prim<number>(null),
        completedFuelTypeName: prim<string>(``),
        completedRate: prim<number>(0),
      },
    },
  },
);
