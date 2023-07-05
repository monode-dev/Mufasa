import { Tank } from "@/AppData";
import { Doc } from "@/mufasa/Implement";
import { exists } from "@/utils";

export const CUBIC_INCHES_PER_GALLON = 231;

export type TankShapeId = `rectangle`;
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
  rectangle: {
    nameLong: `Rectangle`,
    nameShort: `Rect.`,
    dimensions: [`length`, `depth`, `height`],
    calcFilledVolume(tank, stickedInches) {
      if (
        !exists(tank?.length) ||
        !exists(tank?.depth) ||
        !exists(stickedInches)
      ) {
        return undefined;
      }
      return (
        (tank?.length! * tank?.depth! * stickedInches) / CUBIC_INCHES_PER_GALLON
      );
    },
    calcTotalVolume(tank) {
      if (
        !exists(tank?.length) ||
        !exists(tank?.depth) ||
        !exists(tank?.height)
      ) {
        return undefined;
      }
      return (
        (tank?.length! * tank?.depth! * tank?.height!) / CUBIC_INCHES_PER_GALLON
      );
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
    case `height`:
      return `Height`;
    case `diameter`:
      return `Diameter`;
    case `shortHeight`:
      return `Short Height`;
  }
}

export function calcGallonsToReachPercent(
  tank: Partial<Tank>,
  stickedInches: number | null | undefined,
  targetPercent: number,
): number | undefined {
  if (!exists(tank.shape)) return undefined;
  const tankShape = getTankShape(tank.shape);
  const currentFill = tankShape.calcFilledVolume(tank, stickedInches);
  if (!exists(currentFill)) return undefined;
  const totalVolume = tankShape.calcTotalVolume(tank);
  if (!exists(totalVolume)) return undefined;
  return Math.max(0, totalVolume * targetPercent - currentFill);
}
