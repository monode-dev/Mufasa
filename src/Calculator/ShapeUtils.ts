import { exists } from "miwi";
import { createMutable } from "solid-js/store";
import { Tank } from "@/Tanks/Tank";
import hCylIcon from "@/assets/H-cylinder-tank.png";
import rectIcon from "@/assets/Rectangle-tank.png";
import vCylIcon from "@/assets/V-cylinder-tank.png";
import ellipseIcon from "@/assets/Ellipse-tank.png";
import truckBedIcon from "@/assets/L-tank.png";
import capsuleIcon from "@/assets/Pill-tank.png";

export const CUBIC_INCHES_PER_GALLON = 231;

export type TankShapeId =
  | `horizontalCylinder`
  | `rectangle`
  | `verticalCylinder`
  | `horizontalEllipse`
  | `oval`
  | `truckBedTank`;
// | `diamondTank`;
export type TankDimension =
  | `length`
  | `depth`
  | `topDepth`
  | `height`
  | `fullHeight`
  | `squareHeight`
  | `wideHeight`
  | `fullDepth`
  | `diameter`;
// | `squareSide`
// | `rectangularSide`;
//   The equation in the picture only works with rectangular prism tanks when
//   two of the six sides of the rectangular prism are perfect squares,
//   and the other four sides are rectangles. Therefore there are only two dimensions.
export type TankGeometry = {
  [Key in TankDimension | `shape`]: Tank[Key];
};
export function createReactiveTankGeometry(): TankGeometry {
  return createMutable<TankGeometry>({
    shape: null,
    length: null,
    depth: null,
    topDepth: null,
    fullDepth: null,
    height: null,
    squareHeight: null,
    wideHeight: null,
    fullHeight: null,
    diameter: null,
    // side: null
  });
}
export type TankShapeDetails = {
  readonly nameLong: string;
  readonly nameShort: string;
  readonly dimensions: TankDimension[];
  readonly iconImage: string;
  calcFilledVolume(
    tank: Partial<Tank> | null | undefined,
    stickedInches: number | null | undefined,
  ): number | undefined;
  calcTotalVolume(tank: Partial<Tank> | null | undefined): number | undefined;
};
const _tankShapes: {
  readonly [Key in TankShapeId]: TankShapeDetails;
} = {
  horizontalCylinder: {
    nameLong: `Horizontal Cylinder`,
    nameShort: `H. Cyl.`,
    dimensions: [`length`, `diameter`],
    iconImage: hCylIcon,
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [`length`, `diameter`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      const area = calcCircleSegmentArea(tank?.diameter!, stickedInches);
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
    iconImage: rectIcon,
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
    iconImage: vCylIcon,
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
  horizontalEllipse: {
    nameLong: `Ellipse`,
    nameShort: `Ellipse`,
    dimensions: [`length`, `height`, `depth`],
    iconImage: ellipseIcon,
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [`length`, `height`, `depth`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      const area = calcEllipseSegmentArea(
        tank?.depth!,
        tank?.height!,
        stickedInches,
      );
      return (tank?.length! * area) / CUBIC_INCHES_PER_GALLON;
    },
    calcTotalVolume(tank) {
      for (const dimension of [`length`, `height`, `depth`] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      return (
        (calcEllipseArea(tank?.depth!, tank?.height!) * tank?.length!) /
        CUBIC_INCHES_PER_GALLON
      );
    },
  },
  oval: {
    nameLong: `Capsule`,
    nameShort: `Capsule`,
    dimensions: [`length`, `depth`, `fullHeight`, `squareHeight`],
    iconImage: capsuleIcon,
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [
        `length`,
        `depth`,
        `fullHeight`,
        `squareHeight`,
      ] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;

      // Compute relevant tank info
      const ellipseHeight = tank?.fullHeight! - tank?.squareHeight!;

      // Distribute the fuel between the parts
      let undistributedFuel = stickedInches;
      let inchesInEllipse = Math.min(undistributedFuel, ellipseHeight / 2);
      undistributedFuel = Math.max(undistributedFuel - inchesInEllipse, 0);
      const inchesInRectangle = Math.min(
        undistributedFuel,
        tank?.squareHeight!,
      );
      undistributedFuel = Math.max(undistributedFuel - inchesInRectangle, 0);
      inchesInEllipse += Math.min(undistributedFuel, ellipseHeight / 2);
      undistributedFuel = Math.max(undistributedFuel - inchesInEllipse, 0);

      // Calculate the volume of the filled parts
      const ellipseArea = calcEllipseSegmentArea(
        tank?.depth!,
        ellipseHeight,
        inchesInEllipse,
      );
      const rectangleArea = inchesInRectangle * tank?.depth!;
      const filledArea = ellipseArea + rectangleArea;
      return (filledArea * tank?.length!) / CUBIC_INCHES_PER_GALLON;
    },
    calcTotalVolume(tank) {
      for (const dimension of [
        `length`,
        `depth`,
        `fullHeight`,
        `squareHeight`,
      ] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }

      const ellipseHeight = tank?.fullHeight! - tank?.squareHeight!;
      const ellipseArea = calcEllipseArea(tank?.depth!, ellipseHeight);
      const rectangleArea = tank?.squareHeight! * tank?.depth!;

      return (
        ((rectangleArea + ellipseArea) * tank?.length!) /
        CUBIC_INCHES_PER_GALLON
      );
    },
  },
  truckBedTank: {
    nameLong: `L-Shaped`,
    nameShort: `L-Shaped`,
    dimensions: [`length`, `fullDepth`, `topDepth`, `fullHeight`, `wideHeight`],
    iconImage: truckBedIcon,
    calcFilledVolume(tank, stickedInches) {
      for (const dimension of [
        `length`,
        `topDepth`,
        `fullDepth`,
        `wideHeight`,
        `fullHeight`,
      ] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      if (!exists(stickedInches)) return undefined;
      const levelInLowerPart = Math.min(tank?.wideHeight!, stickedInches);
      const volumeInLowerPart =
        levelInLowerPart * tank?.length! * tank?.fullDepth!;
      const levelInUpperPart = Math.max(
        0,
        tank?.fullHeight! - tank?.wideHeight!,
        stickedInches - tank?.wideHeight!,
      );
      const volumeInUpperPart =
        levelInUpperPart * tank?.length! * tank?.topDepth!;
      return (volumeInLowerPart + volumeInUpperPart) / CUBIC_INCHES_PER_GALLON;
    },
    calcTotalVolume(tank) {
      for (const dimension of [
        `length`,
        `topDepth`,
        `fullDepth`,
        `wideHeight`,
        `fullHeight`,
      ] as const) {
        if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
          return undefined;
        }
      }
      const volumeInLowerPart =
        tank?.length! * tank?.fullDepth! * tank?.wideHeight!;
      const volumeInUpperPart =
        tank?.length! *
        tank?.topDepth! *
        (tank?.fullHeight! - tank?.wideHeight!);
      return (volumeInLowerPart + volumeInUpperPart) / CUBIC_INCHES_PER_GALLON;
    },
  },
  //  diamondTank: {
  //   nameLong: `Diamond Tank`,
  //   nameShort: `Diamond`,
  //   dimensions: [`squareSide`, `rectangularSide`],
  //   calcFilledVolume(tank, stickedInches) {
  //     for (const dimension of [`squareSide`, `rectangularSide`] as const) {
  //       if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
  //         return undefined;
  //       }
  //     }
  //     if (!exists(stickedInches)) return undefined;

  //     const squareSide = tank?.squareSide!;
  //     const rectangularSide = tank?.rectangularSide!;
  //     const h = stickedInches;
  //     const halfDiagonal = Math.sqrt(squareSide ** 2 + squareSide ** 2) / 2;

  //     if (h < halfDiagonal) {
  //       return (h ** 2 * rectangularSide) / CUBIC_INCHES_PER_GALLON;
  //     } else {
  //       return ((squareSide * squareSide * rectangularSide) / CUBIC_INCHES_PER_GALLON) - (((Math.sqrt(squareSide ** 2 + squareSide ** 2) - h) * rectangularSide) / CUBIC_INCHES_PER_GALLON);
  //     }
  //   },
  //   calcTotalVolume(tank) {
  //     for (const dimension of [`squareSide`, `rectangularSide`] as const) {
  //       if (!exists(tank?.[dimension]) || tank?.[dimension]! <= 0) {
  //         return undefined;
  //       }
  //     }
  //     const squareSide = tank?.squareSide!;
  //     const rectangularSide = tank?.rectangularSide!;
  //     return (squareSide * squareSide * rectangularSide) / CUBIC_INCHES_PER_GALLON;
  //   },
  // },
};
export const TANK_SHAPE_IDS: readonly TankShapeId[] = Object.keys(
  _tankShapes,
) as any;

export function getTankShape<T extends TankShapeId | null | undefined>(
  shapeId: T,
): T extends null | undefined ? undefined : TankShapeDetails {
  return (exists(shapeId) ? _tankShapes[shapeId] : undefined) as any;
}

export function getDimensionLabel(dimension: TankDimension): string {
  switch (dimension) {
    case `length`:
      return `Length`;
    case `depth`:
      return `Width`;
    case `fullDepth`:
      return `Full Width`;
    case `topDepth`:
      return `Short Width`;
    case `height`:
      return `Height`;
    case `fullHeight`:
      return `Full Height`;
    case `squareHeight`:
      return `Rect. Height`;
    case `wideHeight`:
      return `Short Height`;
    case `diameter`:
      return `Diameter`;
  }
  return `unknown`;
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
  const currentFill = tankShape?.calcFilledVolume(tank, stickedInches);
  if (!exists(currentFill)) return undefined;
  const totalVolume = tankShape?.calcTotalVolume(tank);
  if (!exists(totalVolume)) return undefined;
  return Math.max(0, totalVolume * targetPercent - currentFill);
}

function calcEllipseArea(depth: number, height: number): number {
  return (Math.PI * height * depth) / 4;
}

function calcEllipseSegmentArea(
  depth: number,
  height: number,
  stickedInches: number,
): number {
  // See: https://www.had2know.org/academics/ellipse-segment-tank-volume-calculator.html
  const shouldMeasureEmptySpaceInstead = stickedInches > height / 2;
  const segmentHeight = shouldMeasureEmptySpaceInstead
    ? height - stickedInches
    : stickedInches;
  let area =
    ((height * depth) / 4) *
    (Math.acos(1 - (2 * segmentHeight) / height) -
      (1 - (2 * segmentHeight) / height) *
        Math.sqrt(
          (4 * segmentHeight) / height -
            (4 * Math.pow(segmentHeight, 2)) / Math.pow(height, 2),
        ));
  if (shouldMeasureEmptySpaceInstead) {
    area = (Math.PI * height * depth) / 4 - area; // Area of the filled space
  }
  return area;
}

function calcCircleSegmentArea(
  diameter: number,
  stickedInches: number,
): number {
  // See: https://www.mathsisfun.com/geometry/cylinder-horizontal-volume.html
  const radius = diameter / 2;
  const shouldMeasureEmptySpaceInstead = stickedInches > radius;
  const segmentHeight = shouldMeasureEmptySpaceInstead
    ? diameter - stickedInches
    : stickedInches;
  let area =
    Math.acos((radius - segmentHeight) / radius) * Math.pow(radius, 2) -
    (radius - segmentHeight) *
      Math.sqrt(2 * radius * segmentHeight - Math.pow(segmentHeight, 2));
  if (shouldMeasureEmptySpaceInstead) {
    area = Math.PI * Math.pow(radius, 2) - area; // Area of the filled space
  }
  return area;
}
