import {
  Box,
  doWatch,
  EnterKeyHint,
  exists,
  Label, mdColors,
  NumField,
  Prop,
  useFormula, useProp,
} from "miwi";
import {
  getDimensionLabel,
  getTankShape,
  TankDimension,
  TankGeometry,
} from "@/Calculator/ShapeUtils";
import { For, onCleanup } from "solid-js";
import ShapeSelector from "@/Calculator/ShapeSelector";

const _dimensionHintText = `in.`;

// Tank Fields
export default function TankFields(props: {
  create?: boolean;
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
    const warning = props.warningMessage;
    // no reason to process this if nobody wants the message
    if (!exists(warning)) return;

    const shapeId = props.tankGeometry.shape;
    warning.value = null;
    if (!exists(shapeId)) {
      warning.value = `Please select a shape.`;
      return;
    }

    switch (shapeId) {
      case "truckBedTank":
        if (
          props.tankGeometry.topDepth &&
          props.tankGeometry.fullDepth &&
          props.tankGeometry.topDepth >= props.tankGeometry.fullDepth
        ) {
          warning.value = "Top Depth must be less than Full Depth.";
          return;
        } else if (
          props.tankGeometry.wideHeight &&
          props.tankGeometry.fullHeight &&
          props.tankGeometry.wideHeight >= props.tankGeometry.fullHeight
        ) {
          warning.value = "Wide Height must be less than Full Height.";
          return;
        }
        break;
      case "oval":
        if (
          props.tankGeometry.squareHeight &&
          props.tankGeometry.fullHeight &&
          props.tankGeometry.squareHeight >= props.tankGeometry.fullHeight
        ) {
          warning.value = "Rect. Height must be less than Full Height.";
          return;
        }
    }
  });

  function enterKey(index: () => number): EnterKeyHint {
    if (!props.create) return `done`;
    const nextIndex = index().valueOf() + 1;
    const needsData = dimensions.value.length > nextIndex
      // if the next dimension is not set or is 0, we need data
      ? (props.tankGeometry[dimensions.value[nextIndex]] ?? 0) <= 0
      : false;
    const key: EnterKeyHint = needsData ? `next` : `done`;
    // 1 based not 0 based
    enterHintRefs.value.set(index() + 1, key);
    return key;
  }

  const fieldRefs: Prop<Map<number,HTMLDivElement>> = useProp(new Map());
  // filled in enterKey() function
  const enterHintRefs: Prop<Map<number, EnterKeyHint>> = useProp(new Map());

  return (
    <>
      <Box padBottom={0.25}>
        <ShapeSelector
          value={useFormula(
            () => {
              // is crashing with props.tankGeometry.shape ?? null
              // so...
              const tg = props.tankGeometry;
              if (exists(tg)) if (exists(tg.shape)) return tg.shape;
              return null;
            },
            (newValue) => (props.tankGeometry.shape = newValue),
          )}
          label="Shape"
        />
      </Box>
      {/* We need these to be one-per line for the tank dialog. */}
      <For each={dimensions.value}>
        {(dim, index) => {
          // Index is 0 based, but we want 1 based for IndexedField to match tabIndex rules
          const indexRef = useProp(index() + 1);
          return (
            <Label label={getDimensionLabel(dim)}>
                <NumField
                  negativesAreAllowed={false}
                  hint={_dimensionHintText}
                  value={useFormula(
                    () => props.tankGeometry[dim],
                    (val) => (props.tankGeometry[dim] = val),
                  )}
                  underlined
                  stroke={mdColors.black}
                  enterKeyHint={ useFormula(() => enterKey(index)).value }
                />
            </Label>
          );
        }}
      </For>
    </>
  );
}
