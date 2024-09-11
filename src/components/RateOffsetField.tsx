import { mdiPlusMinusVariant } from "@mdi/js";
import { EnterKeyHint, Label, NumField, Prop, useProp } from "miwi";

export function RateOffsetField(props: {
  rateOffset?: Prop<number | null | undefined>;
  enterKeyHit?: EnterKeyHint;
  iconPath?: string;
  label?: string;
}) {
  return (
    <Label label={props.label}>
      <NumField
        hint={`$0.00 / gal.`}
        icon={props.iconPath}
        value={props.rateOffset}
        underlined
        keyboard={"decimal"}
        enterKeyHint={props.enterKeyHit}
        negativesAreAllowed
        onlyWriteOnBlur
      />
    </Label>

  );
}
