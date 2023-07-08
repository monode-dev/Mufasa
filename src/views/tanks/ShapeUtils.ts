import { Tank } from "@/AppData";
import { Doc } from "@/mufasa/Implement";
import { exists } from "@/utils";

export const CUBIC_INCHES_PER_GALLON = 231;

export type TankShapeId =
  | `horizontalCylinder`
  | `rectangle`
  | `verticalCylinder`
  | `truckBedTank`;
export type TankDimension = Exclude<
  keyof Tank,
  `optionalLabel` | `fuelType` | `shape` | `creationTimePosix` | keyof Doc
>;
export type TankShapeDatails = {
  readonly nameLong: string;
  readonly nameShort: string;
  readonly dimensions: TankDimension[];
  calcFilledVolume(
    tank: Partial<Tank> | null | undefined,
    stickedInches: number | null | undefined,
  ): number | undefined;
  calcTotalVolume(tank: Partial<Tank> | null | undefined): number | undefined;
};
const _tankShapes: {
  readonly [Key in TankShapeId]: TankShapeDatails;
} = {
  horizontalCylinder: {
    nameLong: `Horizontal Cylinder`,
    nameShort: `H. Cyl.`,
    dimensions: [`length`, `diameter`],
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [`length`, `diameter`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      const radius = tank?.diameter! / 2;
      const shouldMeasureEmptySpaceInstead = stickedInches > radius;
      const segmentHeight = shouldMeasureEmptySpaceInstead
        ? tank?.diameter! - stickedInches
        : stickedInches;
      let area =
        Math.acos((radius - segmentHeight) / radius) * Math.pow(radius, 2) -
        (radius - segmentHeight) *
          Math.sqrt(2 * radius * segmentHeight - Math.pow(segmentHeight, 2));
      if (shouldMeasureEmptySpaceInstead) {
        area = Math.PI * Math.pow(radius, 2) - area; // Area of the filled space
      }
      return (tank?.length! * area) / CUBIC_INCHES_PER_GALLON;
    },
    calcTotalVolume(tank) {
      for (const dimension of [`length`, `diameter`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      const radius = tank?.diameter! / 2;
      return (
        (Math.PI * Math.pow(radius, 2) * tank?.length!) /
        CUBIC_INCHES_PER_GALLON
      );
    },
  },
  rectangle: {
    nameLong: `Rectangle`,
    nameShort: `Rect.`,
    dimensions: [`length`, `depth`, `height`],
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [`length`, `depth`, `height`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      return (
        (tank?.length! * tank?.depth! * stickedInches) / CUBIC_INCHES_PER_GALLON
      );
    },
    calcTotalVolume(tank) {
      for (const dimension of [`length`, `depth`, `height`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      return (
        (tank?.length! * tank?.depth! * tank?.height!) / CUBIC_INCHES_PER_GALLON
      );
    },
  },
  verticalCylinder: {
    nameLong: `Vertical Cylinder`,
    nameShort: `V. Cyl.`,
    dimensions: [`height`, `diameter`],
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [`diameter`, `height`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      const radius = tank?.diameter! / 2;
      return (
        (Math.PI * Math.pow(radius, 2) * stickedInches) /
        CUBIC_INCHES_PER_GALLON
      );
    },
    calcTotalVolume(tank) {
      for (const dimension of [`diameter`, `height`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      const radius = tank?.diameter! / 2;
      return (
        (Math.PI * Math.pow(radius, 2) * tank?.height!) /
        CUBIC_INCHES_PER_GALLON
      );
    },
  },
  truckBedTank: {
    nameLong: `Truck Bed Tank`,
    nameShort: `Truck Bed`,
    dimensions: [
      `length`,
      `shortDepth`,
      `fullDepth`,
      `shortHeight`,
      `fullHeight`,
    ],
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [
        `length`,
        `shortDepth`,
        `fullDepth`,
        `shortHeight`,
        `fullHeight`,
      ] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      const levelInLowerPart = Math.min(tank?.shortHeight!, stickedInches);
      const volumeInLowerPart =
        levelInLowerPart * tank?.length! * tank?.fullDepth!;
      const levelInUpperPart = Math.max(
        0,
        tank?.height! - tank?.shortHeight!,
        stickedInches - tank?.shortHeight!,
      );
      const volumeInUpperPart =
        levelInUpperPart * tank?.length! * tank?.shortDepth!;
      return (volumeInLowerPart + volumeInUpperPart) / CUBIC_INCHES_PER_GALLON;
    },
    calcTotalVolume(tank) {
      for (const dimension of [
        `length`,
        `shortDepth`,
        `fullDepth`,
        `shortHeight`,
        `fullHeight`,
      ] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      const volumeInLowerPart =
        tank?.length! * tank?.fullDepth! * tank?.shortHeight!;
      const volumeInUpperPart =
        tank?.length! *
        tank?.shortDepth! *
        (tank?.height! - tank?.shortHeight!);
      return (volumeInLowerPart + volumeInUpperPart) / CUBIC_INCHES_PER_GALLON;
    },
  },
};
export const TANK_SHAPE_IDS: readonly TankShapeId[] = Object.keys(
  _tankShapes,
) as any;

export function getTankShape<T extends TankShapeId | null | undefined>(
  shapeId: T,
): T extends null | undefined ? undefined : TankShapeDatails {
  return (exists(shapeId) ? _tankShapes[shapeId] : undefined) as any;
}

export function getDimensionLabel(dimension: TankDimension): string {
  switch (dimension) {
    case `length`:
      return `Length`;
    case `depth`:
      return `Depth`;
    case `fullDepth`:
      return `Full Depth`;
    case `shortDepth`:
      return `Short Depth`;
    case `height`:
      return `Height`;
    case `fullHeight`:
      return `Full Height`;
    case `shortHeight`:
      return `Short Height`;
    case `diameter`:
      return `Diameter`;
  }
}

export function calcGallonsToReachPercent(
  tank:
    | Partial<{
        [Key in TankDimension | `shape`]: Tank[Key];
      }>
    | null
    | undefined,
  stickedInches: number | null | undefined,
  targetPercent: number,
): number | undefined {
  if (!exists(tank) || !exists(tank?.shape)) return undefined;
  const tankShape = getTankShape(tank.shape);
  const currentFill = tankShape.calcFilledVolume(tank, stickedInches);
  if (!exists(currentFill)) return undefined;
  const totalVolume = tankShape.calcTotalVolume(tank);
  if (!exists(totalVolume)) return undefined;
  return Math.max(0, totalVolume * targetPercent - currentFill);
}
