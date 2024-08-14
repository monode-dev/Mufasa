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
} from "miwi";
import { FuelType } from "@/model/DataModel";

export default function FuelTypeEntry(props: { fuelType: FuelType }) {
  function deletePressed() {
    pushPage(DeleteDialog, {
      obj: props.fuelType,
      message: `Are you sure you want to permanently delete "${
        props.fuelType.name ?? `this fuel type`
      }"? Associated tanks will have their fuel type set to "None".`,
    });
  }

  return (
    <Row widthGrows padBetween={1} alignLeft>
      <Field
        value={useFormula(
          () => props.fuelType.name ?? ``,
          (v) => (props.fuelType.name = v),
        )}
        underlined
        hintText="Unnamed"
      />
      <NumField
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
