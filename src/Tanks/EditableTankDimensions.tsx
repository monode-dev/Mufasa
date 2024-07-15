// noinspection t

import { Box, useFormula, NumField, Row, Txt, Prop, ReadonlyProp } from "miwi";
import { getDimensionLabel, getTankShape } from "@/Calculator/ShapeUtils";
import { Show } from "solid-js";
import ShapeSelector from "@/Calculator/ShapeSelector";
import { Tank } from "./Tank";

const _in = `in.`;

export type BadTruckBed = null | "both" | "depth" | "height";

// Editable Tank Fields
export default function EditableTankDimensions(
  props: Readonly<{
    tank: Tank;
    isEditing: boolean;
    zeroValueWarning: Prop<boolean>;
    invalidTruckBedWarning: Prop<BadTruckBed>;
  }>,
) {
  // TODO: TankFields does this a second way.  We should unify.
  function depthError(tank: Tank) {
    return !!(
      tank.topDepth &&
      tank.fullDepth &&
      tank.topDepth >= tank.fullDepth
    );
  }

  function heightError(tank: Tank) {
    return !!(
      tank.wideHeight &&
      tank.fullHeight &&
      tank.wideHeight >= tank.fullHeight
    );
  }

  // TODO: badTruckBed and badDimValue must be in sync, this should be simplified, TankFields may have some input on this.
  const badTruckBed: { value: BadTruckBed } = useFormula(() => {
    const de = depthError(props.tank);
    const he = heightError(props.tank);
    if (de && he) return `both`;
    if (de) return `depth`;
    if (he) return `height`;
    return null;
  });
  const tankShapeId = useFormula(() => {
    const id = props.tank.shape ?? null;
    props.invalidTruckBedWarning.value = badTruckBed.value;
    return id;
  });

  const tankShapeDetails = useFormula(() => getTankShape(tankShapeId?.value));

  const dimensions = useFormula(() => {
    return tankShapeDetails?.value?.dimensions ?? [];
  });
  //TODO: here we see the explosion of complexity, we should simplify this to something more similar to TankFields.
  const badDimValue: ReadonlyProp<boolean>[] = [];
  for (let i = 0; i < 5; i++) {
    badDimValue[i] = useFormula(() => {
      return (
        (tankDimValue(i) ?? 0) == 0 ||
        (tankShapeId.value == "truckBedTank" &&
          ((badTruckBed.value === `both` &&
            (dimensions.value[i] == "topDepth" ||
              dimensions.value[i] == "fullDepth" ||
              dimensions.value[i] == "wideHeight" ||
              dimensions.value[i] == "fullHeight")) ||
            (badTruckBed.value === `depth` &&
              (dimensions.value[i] == "topDepth" ||
                dimensions.value[i] == "fullDepth")) ||
            (badTruckBed.value === `height` &&
              (dimensions.value[i] == "wideHeight" ||
                dimensions.value[i] == "fullHeight"))))
      );
    });
  }

  function tankDimValue(i: number) {
    const dim = dimensions.value[i];
    const val = props.tank[dim] ?? null;
    props.zeroValueWarning.value = (val ?? 0) === 0;
    return val;
  }

  function dimErrorColor(i: number) {
    if (badDimValue[i].value) return "red";
    else return undefined;
  }

  return (
    <>
      <Row alignTopLeft>
        <Show when={props.isEditing}>
          <ShapeSelector
            value={useFormula(
              () => props.tank.shape ?? null,
              (newValue) => (props.tank.shape = newValue),
            )}
            label="Shape"
          />
        </Show>
        <Show when={!props.isEditing}>
          <Txt widthGrows heightShrinks overflowX={$Overflow.wrap}>
            {
              useFormula(() => tankShapeDetails?.value?.nameLong ?? "Shape")
                .value
            }
          </Txt>
        </Show>
      </Row>
      {/* We need these to be one-per line for the tank dialog. */}
      <Show when={props.tank.shape && dimensions.value.length > 0}>
        <Box axis={$Axis.row} padBetween={1}>
          <Show when={dimensions.value.length > 0}>
            <Row widthGrows>
              <Txt>{getDimensionLabel(dimensions.value[0]) + `:`}</Txt>
              <NumField
                valueSig={useFormula(
                  () => tankDimValue(0),
                  (val) => (props.tank[dimensions.value[0]] = val),
                )}
                hint={_in}
                underlined
                outlineColor={dimErrorColor(0)}
              />
            </Row>
          </Show>

          <Show when={dimensions.value.length > 1}>
            <Row widthGrows>
              <Txt>{getDimensionLabel(dimensions.value[1]) + `:`}</Txt>
              <NumField
                valueSig={useFormula(
                  () => tankDimValue(1),
                  (val) => (props.tank[dimensions.value[1]] = val),
                )}
                hint={_in}
                underlined
                outlineColor={dimErrorColor(1)}
              />
            </Row>
          </Show>
        </Box>

        <Show when={dimensions.value.length > 2}>
          <Box widthGrows axis={$Axis.row} padBetween={1}>
            <Show when={dimensions.value.length > 2}>
              <Row widthGrows>
                <Txt>{getDimensionLabel(dimensions.value[2]) + `:`}</Txt>
                <NumField
                  valueSig={useFormula(
                    () => tankDimValue(2),
                    (val) => (props.tank[dimensions.value[2]] = val),
                  )}
                  hint={_in}
                  underlined
                  outlineColor={dimErrorColor(2)}
                />
              </Row>
            </Show>

            <Show when={dimensions.value.length > 3}>
              <Row widthGrows>
                <Txt>{getDimensionLabel(dimensions.value[3]) + `:`}</Txt>
                <NumField
                  valueSig={useFormula(
                    () => tankDimValue(3),
                    (val) => (props.tank[dimensions.value[3]] = val),
                  )}
                  hint={_in}
                  underlined
                  outlineColor={dimErrorColor(3)}
                />
              </Row>
            </Show>
          </Box>
        </Show>

        <Show when={dimensions.value.length > 4}>
          <Box widthGrows axis={$Axis.row} padBetween={1}>
            <Show when={dimensions.value.length > 4}>
              <Row widthGrows>
                <Txt>{getDimensionLabel(dimensions.value[4]) + `:`}</Txt>
                <NumField
                  valueSig={useFormula(
                    () => tankDimValue(4),
                    (val) => (props.tank[dimensions.value[4]] = val),
                  )}
                  hint={_in}
                  underlined
                  outlineColor={dimErrorColor(4)}
                />
              </Row>
            </Show>

            <Show when={dimensions.value.length > 5}>
              <Row widthGrows>
                <Txt>{getDimensionLabel(dimensions.value[5]) + `:`}</Txt>
                <NumField
                  valueSig={useFormula(
                    () => tankDimValue(5),
                    (val) => (props.tank[dimensions.value[5]] = val),
                  )}
                  hint={_in}
                  underlined
                  outlineColor={dimErrorColor(5)}
                />
              </Row>
            </Show>
          </Box>
        </Show>
      </Show>
    </>
  );
}
