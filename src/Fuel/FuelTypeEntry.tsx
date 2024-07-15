import DeleteDialog from "@/components/DeleteDialog";
import { Field, HiddenDelete, NumField, Row, pushPage, useFormula } from "miwi";
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
        valueSig={useFormula(
          () => props.fuelType.rate ?? 0,
          (v) => (props.fuelType.rate = v),
        )}
        hint="$/gal."
        align={$Align.centerLeft}
        width={5}
      />
      <HiddenDelete onDelete={deletePressed} />
    </Row>
  );
}
