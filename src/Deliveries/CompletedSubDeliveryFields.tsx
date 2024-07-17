import {
  Field,
  Label,
  NumField,
  Prop,
  useFormula,
  mdColors,
  useProp,
} from "miwi";

export default function CompletedSubDeliveryFields(props: {
  fuelNameSig: Prop<string | null | undefined>;
  rateSig: Prop<number | null | undefined>;
  gallonsSig: Prop<number | null | undefined>;
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

  props.fuelNameSig;

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
          valueSig={props.rateSig}
          // hasFocus={rateHasFocus}
          underlined
          hint="Rate"
          stroke={rateShouldBeGrey.value ? mdColors.grey : undefined}
        />
      </Label>
      {/** Gallons */}
      <Label label="Gallons" hint={gallonsShouldBeGrey.value}>
        <NumField
          valueSig={props.gallonsSig}
          // hasFocus={gallonsHasFocus}
          underlined
          hint="Est. gal."
          stroke={gallonsShouldBeGrey.value ? mdColors.grey : undefined}
        />
      </Label>
    </>
  );
}
