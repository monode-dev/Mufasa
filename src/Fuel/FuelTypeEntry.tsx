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
  exists, EnterKeyHint, useProp, Prop,
} from "miwi";
import { FuelType } from "@/model/DataModel";
import {onCleanup} from "solid-js";
import {FieldKeyHandler, IndexedField, IndexedFieldKeyHandler} from "@/components/IndexedField";

export default function FuelTypeEntry(props: {
  fuelType: FuelType;
  nextFuelType: FuelType | undefined;
}) {
  function deletePressed() {
    pushPage(DeleteDialog, {
      obj: props.fuelType,
      message: `Are you sure you want to permanently delete "${
        props.fuelType.name ?? `this fuel type`
      }"? Associated tanks will have their fuel type set to "None".`,
    });
  }

  onCleanup(() => {
    document.removeEventListener("keydown", (event) => FieldKeyHandler(event));
  });
  document.addEventListener("keydown", (event) => FieldKeyHandler(event));

  let fieldCounter = useProp(0);
  let fieldRefs: Prop<Map<number,HTMLDivElement>> = useProp(new Map());
  // filled in enterKey() function
  const enterHintRefs: Prop<Map<number, EnterKeyHint>> = useProp(new Map());

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

            return key;
          }).value
        }
        />
        <NumField
          enterKeyHint={
          useFormula(() => {
            const key: EnterKeyHint = exists(props.nextFuelType) &&
              (props.nextFuelType.name ?? ``).trim().length == 0
                ? `next`
                : `done`;
            console.log("key: ", key);
            return key;
            }).value
          }
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
