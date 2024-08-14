import DeleteDialog from "@/components/DeleteDialog";
import {
  Field,
  NumField,
  Row,
  pushPage,
  useFormula,
  exists,
} from "miwi";
import { FuelType } from "@/model/DataModel";
import { HiddenOptions } from "@/components/HiddenOptions";
import { Flag } from "mufasa/dist/Utils";

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
        onlyWriteOnBlur
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
        onlyWriteOnBlur
      />
      <HiddenOptions showIcons onDelete={deletePressed} />
    </Row>
  );
}
