import {
  Field,
  Label,
  NumField,
  Prop,
  useFormula,
  mdColors,
  useProp,
  Box,
  exists,
  Icon,
  Row,
  SIZE_SHRINKS,
  Txt,
} from "miwi";
import { Switch, Match } from "solid-js";

export default function CompletedSubDeliveryFields(props: {
  fuelNameSig: Prop<string | null | undefined>;
  rateSig: Prop<number | null | undefined>;
  gallonsSig: Prop<number | null | undefined>;
  stickedInchesBeforeFillingSig: Prop<number | null | undefined>;
  stickedInchesAfterFillingSig: Prop<number | null | undefined>;
  allGrey?: boolean;
}) {
  const fuelHasFocus = useProp(false);
  const fuelShouldBeGrey = useFormula(
    () => props.allGrey && !fuelHasFocus.value,
  );
  const rateHasFocus = useProp(false);
  const rateShouldBeGrey = useFormula(
    () => props.allGrey && !rateHasFocus.value,
  );
  const gallonsHasFocus = useProp(false);
  const gallonsShouldBeGrey = useFormula(
    () => props.allGrey && !gallonsHasFocus.value,
  );

  const stickedInchesBeforeFillingHasFocus = useProp(false);
  const stickedInchesBeforeFillingShouldBeGrey = useFormula(
    () => props.allGrey && !stickedInchesBeforeFillingHasFocus.value,
  );

  const stickedInchesAfterFillingHasFocus = useProp(false);
  const stickedInchesAfterFillingShouldBeGrey = useFormula(
    () => props.allGrey && !stickedInchesAfterFillingHasFocus.value,
  );

  props.fuelNameSig;
  const tempProp = useProp(``);

  return (
    <>
      {/** Fuel */}
      <Label label="Fuel" hint={fuelShouldBeGrey.value}>
        <Field
          value={useFormula(
            () => props.fuelNameSig.value ?? ``,
            (newVal) => (props.fuelNameSig.value = newVal),
          )}
          // hasFocus={fuelHasFocus}
          underlined
          hintText="Fuel Name"
          stroke={fuelShouldBeGrey.value ? mdColors.grey : undefined}
          capitalize={`words`}
          keyboard={"text"}
        />
      </Label>
      {/** Rate */}
      <Label label="Rate" hint={rateShouldBeGrey.value}>
        <NumField
          value={props.rateSig}
          // hasFocus={rateHasFocus}
          underlined
          hint="Rate"
          stroke={rateShouldBeGrey.value ? mdColors.grey : undefined}
        />
      </Label>
      {/** Gallons */}
      <Label label="Gallons" hint={gallonsShouldBeGrey.value}>
        <NumField
          value={props.gallonsSig}
          // hasFocus={gallonsHasFocus}
          underlined
          hint="Est. gal."
          stroke={gallonsShouldBeGrey.value ? mdColors.grey : undefined}
        />
      </Label>
      {/** Sticked Inches Before Filling */}
      <Label label="Sticked Inches Before" hint={stickedInchesBeforeFillingShouldBeGrey.value}>
        <NumField
          value={props.stickedInchesBeforeFillingSig}
          // hasFocus={gallonsHasFocus}
          underlined
          hint='in.'
          stroke={stickedInchesBeforeFillingShouldBeGrey.value ? mdColors.grey : undefined}
        />
      </Label>
      {/** Sticked Inches After Filling */}
      <Label label="Sticked Inches After" hint={stickedInchesAfterFillingShouldBeGrey.value}>
        <NumField
          value={props.stickedInchesAfterFillingSig}
          // hasFocus={gallonsHasFocus}
          underlined
          hint='in.'
          stroke={stickedInchesAfterFillingShouldBeGrey.value ? mdColors.grey : undefined}
        />
      </Label>
    </>
  );
}
