import { tankShape, TankShape } from "@/AppData";
type TankInfo = {
  shape: TankShape;
  length: number;
  depth: number;
  height: number;
  shortHeight: number;
};
export function calcTotalVolume(specs: TankInfo) {
  switch (specs.shape) {
    case tankShape.horizontalCylinder:
      throw new Error(`Not implemented`);

    case tankShape.verticalCylinder:
      throw new Error(`Not implemented`);

    case tankShape.oval:
      const AR2882 = specs.depth / 2;
      const AB69 = specs.length;
      const AB70 = specs.height;
      const AB71 = specs.depth;
      const volume =
        (Math.PI * Math.pow(AR2882, 2) * AB69 + AB70 * AB71 * AB69) / 231;
      return volume;

    case tankShape.rectangle:
      console.log(specs.length, specs.depth, specs.height);
      return (specs.length * specs.depth * specs.height) / 231;

    case tankShape.ellipse:
      ((specs.depth / specs.height) *
        Math.PI *
        Math.pow(specs.height / 2, 2) *
        specs.length) /
        231;

    case tankShape.truckBedTank:
      throw new Error(`Not implemented`);

    default:
      return 0;
  }
}
export function calcCurrentVolume(specs: TankInfo & { stickedDepth: number }) {
  switch (specs.shape) {
    case tankShape.horizontalCylinder:
      throw new Error(`Not implemented`);

    case tankShape.verticalCylinder:
      throw new Error(`Not implemented`);

    case tankShape.oval:
      let result;
      let AB73 = specs.stickedDepth;
      let AR2882 = specs.depth / 2;
      let AR2881 = specs.depth - AB73;
      let AB69 = specs.length;
      let AB70 = specs.height;
      let AB71 = specs.depth;
      if (AB73 < AR2882) {
        result =
          ((Math.PI * Math.pow(AR2882, 2) -
            Math.pow(AR2882, 2) * Math.acos((AR2882 - AR2881) / AR2882) +
            (AR2882 - AR2881) *
              Math.sqrt(2 * AR2882 * AR2881 - Math.pow(AR2881, 2))) *
            AB69) /
          231;
      } else if (AB73 < AB70 + AR2882) {
        result =
          ((AB73 - AR2882) * AB71 * AB69) / 231 +
          (Math.PI * Math.pow(AR2882, 2) * AB69) / 2 / 231;
      } else {
        result =
          (Math.PI * Math.pow(AR2882, 2) -
            Math.pow(AR2882, 2) *
              Math.acos((AR2882 - (AB71 - (AB73 - AB70))) / AR2882) +
            (AR2882 - (AB71 - (AB73 - AB70))) *
              Math.sqrt(
                2 * AR2882 * (AB71 - (AB73 - AB70)) -
                  Math.pow(AB71 - (AB73 - AB70), 2),
              )) *
            AB69 +
          (AB70 * AB71 * AB69) / 231;
      }
      return result;

    case tankShape.rectangle:
      return (specs.length * specs.depth * specs.shortHeight) / 231;

    case tankShape.ellipse:
      return (
        (((Math.PI * Math.pow(specs.height / 2, 2) -
          Math.pow(specs.height / 2, 2) *
            Math.acos(
              (specs.height / 2 - (specs.height - specs.stickedDepth)) /
                (specs.height / 2),
            ) +
          (specs.height / 2 - (specs.height - specs.stickedDepth)) *
            Math.sqrt(
              2 * (specs.height / 2) * (specs.height - specs.stickedDepth) -
                Math.pow(specs.height - specs.stickedDepth, 2),
            )) *
          specs.length) /
          231) *
        (specs.depth / specs.height)
      );

    case tankShape.truckBedTank:
      throw new Error(`Not implemented`);

    default:
      return 0;
  }
}
export function calcGallonsToReachPercent(
  totalVolume: number,
  currentVolume: number,
  percent: number,
) {
  return Math.max(0, totalVolume * percent - currentVolume);
}
