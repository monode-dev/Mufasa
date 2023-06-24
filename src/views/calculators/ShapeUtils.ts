type Dimensions = {
  length: number;
  depth: number;
  height: number;
  shortHeight: number;
};
function defineShapeCalcs(calcs: {
  totalVolume: (dimensions: Dimensions) => number;
  stickedVolume: (dimensions: Dimensions & { stickedDepth: number }) => number;
}) {
  return calcs;
}

export const rectangleTankCalcs = defineShapeCalcs({
  totalVolume: ({ length, depth, height }) => {
    console.log(length, depth, height);
    return (length * depth * height) / 231;
  },
  stickedVolume: ({ length, depth, stickedDepth }) =>
    (length * depth * stickedDepth) / 231,
});

export function gallonsToFillPercent(
  totalVolume: number,
  currentVolume: number,
  percent: number,
) {
  return Math.max(0, totalVolume * percent - currentVolume);
}
