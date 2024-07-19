import {
  Box,
  doWatch,
  exists,
  Label,
  mdColors,
  NumField,
  Prop,
  useFormula,
} from "miwi";
import {
  getDimensionLabel,
  getTankShape,
  TankDimension,
  TankGeometry,
} from "@/Calculator/ShapeUtils";
import { For } from "solid-js";
import ShapeSelector from "@/Calculator/ShapeSelector";

const _dimensionHintText = `in.`;

// Tank Fields
export default function TankFields(props: {
  tankGeometry: TankGeometry;
  oneDimPerRow?: boolean;
  warningMessage?: Prop<string | null>;
}) {
  const dimensions = useFormula<TankDimension[]>(() => {
    if (!exists(props.tankGeometry.shape)) return [];
    const tankShapeDetails = getTankShape(props.tankGeometry.shape);
    return tankShapeDetails.dimensions;
  });

  doWatch(() => {
    const shapeId = props.tankGeometry.shape;
    let message = null;
    if (!exists(shapeId)) message = `Please select a shape.`;
    for (const dimension of dimensions.value) {
      const size = props.tankGeometry[dimension];
      if (toNum(size) <= 0) {
        message = `All dimensions must be greater than zero.`;
        break;
      }
    }
    if (shapeId == "truckBedTank") {
      if (props.tankGeometry.topDepth! >= props.tankGeometry.fullDepth!) {
        message = "Top Depth must be less than Full Depth.";
      } else if (
        props.tankGeometry.wideHeight! >= props.tankGeometry.fullHeight!
      ) {
        message = "Wide Height must be less than Full Height.";
      }
    }
    if (props.warningMessage) {
      props.warningMessage.value = message;
    }
    return;
  });

  function toNum(size: number | null | undefined): number {
    return !exists(size) ? 0 : size;
  }

  return (
    <>
      <Box padBottom={0.25}>
        <ShapeSelector
          value={useFormula(
            () => {
              // is crashing with props.tankGeometry.shape ?? null
              // so...
              const tg = props.tankGeometry;
              if(exists(tg)) if(exists(tg.shape)) return tg.shape
              return null;
            },
            (newValue) => (props.tankGeometry.shape = newValue),
          )}
          label="Shape"
        />
      </Box>
      {/* We need these to be one-per line for the tank dialog. */}
      <For each={dimensions.value}>
        {(dimension) => (
          <Label label={getDimensionLabel(dimension)}>
            <NumField
              negativesAreAllowed={false}
              hint={_dimensionHintText}
              valueSig={useFormula(
                () => props.tankGeometry[dimension],
                (val) => (props.tankGeometry[dimension] = val),
              )}
              underlined
              stroke={mdColors.black}
            />
          </Label>
        )}
      </For>
    </>
  );
}
