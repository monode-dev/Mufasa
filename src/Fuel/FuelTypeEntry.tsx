import DeleteDialog from "@/components/DeleteDialog";
import {
  Field,
  NumField,
  Row,
  pushPage,
  useFormula,
  HiddenOptions,
  DeleteOption,
  theme,
  exists, EnterKeyHint, Prop,
} from "miwi";
import { FuelType } from "@/model/DataModel";

export default function FuelTypeEntry(props: {
  fuelType: FuelType;
  nextFuelType: FuelType | undefined;
  fieldRefs: Prop<Map<number,HTMLDivElement>>;
  // filled in enterKey() function
  enterHintRefs: Prop<Map<number, EnterKeyHint>>;
  subDeliveryIndex: Prop<number>;
}) {
  function deletePressed() {
    pushPage(DeleteDialog, {
      obj: props.fuelType,
      message: `Are you sure you want to permanently delete "${
        props.fuelType.name ?? `this fuel type`
      }"? Associated tanks will have their fuel type set to "None".`,
    });
  }

  // zero based indexes will be combined with subDeliveryIndex
  const fields = 2;
  const baseIndex= useFormula(() => 1 + props.subDeliveryIndex.value * fields);
  const nameIndex = useFormula(() => baseIndex.value);
  const rateIndex = useFormula(() => 1 + baseIndex.value);
  // one based index
  return (
    <Row widthGrows padBetween={1} alignLeft>
        <Field
          value={useFormula(
            () => props.fuelType.name ?? ``,
            (v) => (props.fuelType.name = v),
          )}
          underlined
          hintText="Unnamed"
          enterKeyHint={
          useFormula(() => {
            const key: EnterKeyHint = (props.fuelType.rate ?? 0) <= 0
              ? `next`
              : `done`;
            props.enterHintRefs.value.set(nameIndex.value, key);
            return key;
          }).value }
          onlyWriteOnBlur
        />
        <NumField
          enterKeyHint={
          useFormula(() => {
            const key: EnterKeyHint =
              exists(props.nextFuelType) &&
              (props.nextFuelType.name ?? ``).trim().length == 0
                ? `next`
                : `done`;
            props.enterHintRefs.value.set(rateIndex.value, key);
            return key;
            }).value }
          negativesAreAllowed={false}
          underlined
          value={useFormula(
            () => props.fuelType.rate,
            (v) => (props.fuelType.rate = v),
          )}
          hint="$/gal."
          align={$Align.centerLeft}
          /* We set the rate to a fixed width, because most fuel doesn't have a very big
           * rate. All the rest of the space can be given to the name. Maybe we'll change
           * this in future if it looks too weird. */
          width={5}
          onlyWriteOnBlur
        />
      <HiddenOptions
        cancelOptions={{
          stroke: theme.palette.hint,
        }}
      >
        <DeleteOption onClick={deletePressed} />
      </HiddenOptions>
    </Row>
  );
}
