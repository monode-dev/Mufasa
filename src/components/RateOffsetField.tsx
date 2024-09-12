import { autoSavingProp } from "@/utils";
import { mdiMinus, mdiPlus, mdiPlusMinusVariant } from "@mdi/js";
import {
  doNow,
  EnterKeyHint,
  exists,
  Icon,
  Label,
  NumField,
  Prop,
  Row,
  Stack,
  theme,
  Txt,
  useFormula,
  useProp,
} from "miwi";
import { Show } from "solid-js";

export function RateOffsetField(props: {
  rateOffset: Prop<number | null | undefined>;
  enterKeyHit?: EnterKeyHint;
  label?: string;
}) {
  const positiveValue = useFormula(
    () =>
      exists(props.rateOffset.value)
        ? Math.abs(props.rateOffset.value!)
        : props.rateOffset.value,
    (val) =>
      (props.rateOffset.value = exists(val)
        ? Math.abs(val) * (isNegative.value ? -1 : 1)
        : null),
  );
  const isNegative = useFormula(
    () => exists(props.rateOffset.value) && props.rateOffset.value < 0,
    (val) =>
      (props.rateOffset.value = exists(positiveValue.value)
        ? positiveValue.value * (val ? -1 : 1)
        : null),
  );
  const fieldHasFocus = useProp(false);

  //const isNegativeSign = autoSavingProp<boolean>(`isNegativeSign`, props.rateOffset?.value! < 0);

  return (
    <>
      <Row padBetween={0.25}>
        <Label label={props.label}>
          <Icon
            iconPath={isNegative.value ? mdiMinus : mdiPlus}
            stroke={
              exists(props.rateOffset.value) ? undefined : theme.palette.hint
            }
          />
          <Stack alignTopLeft>
            <Show when={exists(props.rateOffset.value) && !fieldHasFocus.value}>
              <Txt
                widthGrows
                singleLine
                onClick={() => (fieldHasFocus.value = true)}
              >{`${positiveValue.value} / gal.`}</Txt>
            </Show>
            <NumField
              hint={`$0.00 / gal.`}
              value={positiveValue}
              underlined
              keyboard={"decimal"}
              hasFocusSig={fieldHasFocus}
              enterKeyHint={props.enterKeyHit}
              negativesAreAllowed
              onlyWriteOnBlur
            />
          </Stack>
        </Label>
        <Show when={exists(props.rateOffset.value)}>
          <Icon
            iconPath={mdiPlusMinusVariant}
            scale={1.2}
            stroke={$theme.colors.primary}
            onClick={() => {
              isNegative.value = !isNegative.value;
            }}
          />
        </Show>
      </Row>
    </>
  );
}
