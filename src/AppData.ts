import {
  getDimensionLabel,
  getTankShape,
  TankGeometry,
  TankDimension,
} from "@/Calculator/ShapeUtils";
import {
  FloatSort,
  useFormula,
  exists,
  roundToString,
  Prop,
  mdColors,
  doNow,
} from "miwi";
import { FuelType } from "./model/DataModel";
import { Client } from "./Clients/Client";
import { Tank } from "./Tanks/Tank";

export const spaceChar: string = "\u00A0";
// SECTION: Client
export function isClientValid(
  client: Partial<Client> | null | undefined,
): boolean {
  const clientIdExists = useFormula(() =>
    !client ? false : (client.clientId ?? ``).trim() !== ``,
  );
  const nameExists = useFormula(() =>
    !client ? false : (client.name ?? ``).trim() !== ``,
  );
  return clientIdExists.value || nameExists.value;
}
export function getClientLabel(client: Client | null | undefined): string {
  if (!exists(client) || !exists(client?.docId)) return `No Client`;
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
  clients: Iterable<Client>,
  excludeInvalidClients: boolean = false,
): Client[] {
  let prevTime = Date.now();
  let result = [...clients].sort((a, b) => {
    const sortNameA = doNow(() => {
      const name = a?.name?.trim().toLowerCase();
      const nameExists = exists(name) && name !== ``;
      const clientId = a?.clientId?.trim().toLowerCase();
      const clientIdExists = exists(clientId) && clientId !== ``;
      let sortName = name ?? ``;
      if (nameExists && clientIdExists) {
        sortName += ` - `;
      }
      sortName += clientId ?? ``;
      return sortName;
    });
    const sortNameB = doNow(() => {
      const name = b?.name?.trim().toLowerCase();
      const nameExists = exists(name) && name !== ``;
      const clientId = b?.clientId?.trim().toLowerCase();
      const clientIdExists = exists(clientId) && clientId !== ``;
      let sortName = name ?? ``;
      if (nameExists && clientIdExists) {
        sortName += ` - `;
      }
      sortName += clientId ?? ``;
      return sortName;
    });
    return sortNameA.localeCompare(sortNameB);
  });

  console.log(`listClients sorted: ${Date.now() - prevTime}}`);
  prevTime = Date.now();

  if (excludeInvalidClients) {
    result = result.filter(isClientValid);
  }

  console.log(`listClients filtered: ${Date.now() - prevTime}}`);

  return result;
}
export function canCallPhoneNumber(
  phoneNumber: string | undefined | null,
): boolean {
  return exists(phoneNumber) && phoneNumber.trim() !== ``;
}
export function callPhoneNumber(phoneNumber: string | null | undefined) {
  if (!canCallPhoneNumber(phoneNumber)) return;
  const url = `tel:${phoneNumber}`;
  window.open(url, `_blank`);
}
export function canMapToAddress(address: string | null | undefined): boolean {
  return exists(address) && address.trim() !== ``;
}
export function mapToAddress(address: string | null | undefined) {
  if (!canMapToAddress(address)) return;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address!,
  )}`;
  window.open(url, `_blank`);
}

// SECTION: Tank
export function tankVolumeRoundStr(label: TankLabel) {
  return roundToString(label.volume ?? 0, 0) + spaceChar + "Gal.";
}

export function tankDisplayName(
  tank: Partial<Tank> | null | undefined,
  amountOfNoteCharacters: number = 20, //IMPORTANT: This is the default value which we should deicide on.
): string {
  const label = getTankLabel(tank);
  let note = label.notesPart.trim();
  // Check if we need to shorten the note
  if (amountOfNoteCharacters > 0 && note.length > amountOfNoteCharacters) {
    note = note.slice(0, amountOfNoteCharacters);
  }
  if (amountOfNoteCharacters === 0) {
    note = ``;
  }
  return (
    (0 == note.length ? "" : note + " - ") +
    (label.fuelName ?? "New Fuel") +
    " - " +
    (label.dimensionsPart.trim() === "" ? "No Dimensions" : label.dimensionsPart) +
    " - " +
    (label.shapeName ?? "Shape") +
    " - " +
    tankVolumeRoundStr(label)
  );
}

export function isTankValid(tank: Partial<Tank> | null | undefined): boolean {
  if (tank?.shape == `truckBedTank`) {
    let td = tank.topDepth ?? 0;
    let fd = tank.fullDepth ?? 0;
    if (td <= 0 || fd <= 0)
      return false;
    if (td >= fd)
      return false;
  }
  else if(tank?.shape == `oval` ){
    let sh = tank.squareHeight ?? 0;
    let fh = tank.fullHeight ?? 0;
    if(sh <= 0 || fh <= 0)
      return false;
    if(sh >= fh)
      return false;
  }

  const shapeUtils = getTankShape(tank?.shape);
  const volume = shapeUtils?.calcTotalVolume(tank);
  return (
    FuelType.isValid(tank?.fuelType) &&
    exists(shapeUtils?.nameShort) &&
    exists(volume) &&
    volume > 0
  );
}
export class TankLabel {
  dimensionsPart: string;
  fuelName: string | null | undefined;
  notesPart: string;
  shapeName: string | undefined;
  volume: number | undefined;
  constructor(
    dimensionsPart: string,
    fuelName: string | null | undefined,
    notesPart: string,
    shapeName: string | undefined,
    volume: number | undefined,
  ) {
    this.dimensionsPart = dimensionsPart;
    this.fuelName = fuelName;
    this.notesPart = notesPart;
    this.shapeName = shapeName;
    this.volume = volume;
  }
}

export function getTankLabel(
  tank: Partial<Tank> | null | undefined,
): TankLabel {
  // if (!isTankValid(tank)) return `Incomplete Tank`;
  const shapeUtils = getTankShape(tank?.shape);
  const fuelName = tank?.fuelType?.name;
  const volume = shapeUtils?.calcTotalVolume(tank);
  const shapeName = shapeUtils?.nameShort;
  const notesPart =
    exists(tank?.notes) && tank?.notes?.trim() !== `` ? `${tank?.notes}` : ``;
  const dimensionsPart = (() => {
    let result = ``;
    for (const dimension of shapeUtils?.dimensions ?? []) {
      const dimAcronym = getDimensionLabel(dimension)
        ?.split(` `)
        .map((x) => x[0].toUpperCase())
        .join(``);
      const dimValue = tank?.[dimension];
      if (exists(dimValue) && exists(dimAcronym)) {
        result += `${dimAcronym}:${roundToString(dimValue)} `;
      }
    }
    result = result.slice(0, -1);
    return result;
  })();

  return new TankLabel(dimensionsPart, fuelName, notesPart, shapeName, volume);
}
export function listTanks(
  tanks: Iterable<Tank> | undefined,
  excludeInvalidTanks: boolean = false,
) {
  let result = FloatSort.toSorted({
    list: tanks ?? [],
    getPos: (tank) =>
      tank.sortPos ?? tank.creationTimePosix ?? Math.round(100 * Math.random()),
    getUid: (tank) => tank.docId ?? ``,
  });
  if (excludeInvalidTanks) {
    result = result.filter(isTankValid);
  }
  return result;
}

export function getDimensionWarnColor(
  geom: TankGeometry,
  dim: TankDimension,
  badBed: Prop<boolean, boolean>,
) {
  if (!geom || !dim) {
    return mdColors.red;
  } else if ((geom[dim] ?? 0) <= 0) {
    return mdColors.red;
  } else {
    if (geom.shape === "truckBedTank") {
      if (geom.fullDepth) {
        const fd = geom.fullDepth;
        if (geom.topDepth) {
          const td = geom.topDepth;
          if (
            (dim === "topDepth" && td >= fd) ||
            (dim === "fullDepth" && fd <= td)
          ) {
            badBed.value = true;
            return mdColors.red;
          } else badBed.value = false;
        }
      }
      if (geom.fullHeight) {
        const fh = geom.fullHeight;
        if (geom.wideHeight) {
          const wh = geom.wideHeight;
          if (
            (dim === "wideHeight" && wh >= fh) ||
            (dim === "fullHeight" && fh <= wh)
          ) {
            badBed.value = true;
            return mdColors.red;
          } else badBed.value = false;
        }
      }
    }
    return undefined;
  }
}

export function listFuelTypes(
  fuelTypes: Iterable<FuelType> | undefined,
  excludeInvalidFuelTypes: boolean = false,
): FuelType[] {
  let result = [...(fuelTypes ?? [])].sort(
    (a, b) => a.createdPosix - b.createdPosix,
  );
  if (excludeInvalidFuelTypes) {
    result = result.filter(FuelType.isValid);
  }
  return result;
}

// SECTION: App Data Structure
// export const { getAppData, types } = defineAppDataStructure(
//   `firestore`,
//   {
//     apiKey: "AIzaSyDt4S19UxISNKFacXXAQl0I2drGfStspD0",
//     authDomain: "ninety-percent.firebaseapp.com",
//     projectId: "ninety-percent",
//     storageBucket: "ninety-percent.appspot.com",
//     messagingSenderId: "341748622809",
//     appId: "1:341748622809:web:a114f74a7c325fc68de5c8",
//   },
//   {
//     computed: useFormula,
//     signal: useProp,
//     isSignal: _isSignal,
//     watchEffect: doWatch,
//   },
//   {
//     isProduction: false, // && import.meta.env.PROD,
//     getClientStorage: capacitorStorage({
//       readFile: async (path: string) => {
//         // I don't know if the try-catch is necessary, but it's here just in case.
//         try {
//           const results = await Filesystem.readFile({
//             path: path,
//             directory: Directory.Data,
//             encoding: Encoding.UTF8,
//           });
//           return results.data as string;
//         } catch (e) {
//           console.log(`Failed to read: ${path}`);
//           console.log(e);
//           return undefined;
//         }
//       },
//       writeFile: async (path: string, contents: string) => {
//         await Filesystem.writeFile({
//           path: path,
//           data: contents,
//           recursive: true,
//           directory: Directory.Data,
//           encoding: Encoding.UTF8,
//         });
//       },
//       async deleteFile(path: string) {
//         try {
//           await Filesystem.deleteFile({
//             path: path,
//             directory: Directory.Data,
//           });
//         } catch (e) {}
//       },
//     }),
//     rootSchema: {
//       clients: listOf(`Client`),
//       fuelTypes: listOf(`FuelType`),
//       deliveries: listOf(`Delivery`),
//     },
//     typeSchemas: {
//       Client: {
//         name: prim<string>(``),
//         clientId: prim<string>(``),
//         phoneNumber: prim<string>(``),
//         address: prim<string>(``),
//         notes: prim<string>(``),
//         tanks: listOf(`Tank`),
//       },
//       Tank: {
//         notes: prim<string>(``),
//         fuelType: refTo(`FuelType`, null),
//         shape: prim<TankShapeId>(null),
//         length: prim<number>(null),
//         depth: prim<number>(null),
//         topDepth: prim<number>(null),
//         fullDepth: prim<number>(null),
//         height: prim<number>(null),
//         squareHeight: prim<number>(null),
//         wideHeight: prim<number>(null),
//         fullHeight: prim<number>(null),
//         diameter: prim<number>(null),
//         creationTimePosix: prim<number>(() => Date.now()),
//         sortPos: prim<number>(null),
//       },
//       FuelType: {
//         name: prim<string>(null),
//         rate: prim<number>(null),
//         createdPosix: prim<number>(() => Date.now()),
//       },
//       Delivery: {
//         // If we had type unions, these two would combine into `client: Client | ONE_TIME | null`
//         _isOneTimeClient: prim<boolean>(false),
//         _client: refTo(`Client`, null),
//         user: prim<string>(null),

//         clientLabel: prim<string>(null),
//         clientAddress: prim<string>(``),
//         clientPhoneNumber: prim<string>(``),
//         notes: prim<string>(``),
//         sortPosition: prim<number>(null),
//         subDeliveries: listOf(`SubDelivery`),

//         creationTimePosix: prim<number>(() => Date.now()),
//       },
//       SubDelivery: {
//         // If we had type unions, these two would combine into `tank: Tank | ONE_TIME | null`
//         _isJustFuel: prim<boolean>(null),
//         _tank: refTo(`Tank`, null),

//         // If we had type unions, these two would combine into `fuelType: FuelType | ONE_TIME | null`
//         _isOneTimeFuel: prim<boolean>(false),
//         _fuelType: refTo(`FuelType`, null),

//         fuelName: prim<string>(``),
//         rate: prim<number>(null),
//         gallons: prim<number>(null),
//         _sortPosition: prim<number>(null),

//         /** If non-null, then this subDelivery is completed. */
//         completedTimePosix: prim<number>(null),
//       },
//     },
//   },
// );
