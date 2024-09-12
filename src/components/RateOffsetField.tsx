import { autoSavingProp } from "@/utils";
import { mdiMinus, mdiPlus, mdiPlusMinusVariant } from "@mdi/js";
import { doNow, EnterKeyHint, exists, Icon, Label, NumField, Prop, Row, Txt, useFormula, useProp } from "miwi";
import { Show } from "solid-js";

export function RateOffsetField(props: {
  rateOffset: Prop<number | null | undefined>;
  enterKeyHit?: EnterKeyHint;
  iconPath?: string;
  label?: string;
}) {

  const positiveValue = useFormula(
    () => exists(props.rateOffset.value) && props.rateOffset?.value! < 0
      ? props.rateOffset.value * -1
      : props.rateOffset.value!,
    (val) => {(props.rateOffset.value = val * (isNegative.value ? -1 : 1))},
  );
  
  const isNegative = useFormula(
    () => exists(props.rateOffset.value) && props.rateOffset.value < 0,
    (val) => (props.rateOffset.value = positiveValue.value * (val ? -1 : 1)),
  );
  
  //const isNegativeSign = autoSavingProp<boolean>(`isNegativeSign`, props.rateOffset?.value! < 0);

  return (
    <>
      <Row padBetween={0.25}>
        <Label label={props.label}>
          <Icon iconPath={isNegative.value ? mdiMinus : mdiPlus}/>
          <NumField
            hint={`$0.00 / gal.`}
            icon={props.iconPath}
            value={positiveValue}
            underlined
            keyboard={"decimal"}
            enterKeyHint={props.enterKeyHit}
            negativesAreAllowed
            onlyWriteOnBlur
          />
        </Label>
 
        <Txt
          stroke={$theme.colors.primary}
          onClick={() => {
            isNegative.value = !isNegative.value;
            if (props.rateOffset && props.rateOffset.value) {
              //props.rateOffset.value = -props.rateOffset.value;
            }
          }}
        >
          Change sign
        </Txt>
      </Row>

    </>
  );
}
