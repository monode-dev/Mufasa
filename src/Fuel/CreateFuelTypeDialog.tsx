import { FuelType } from "@/model/DataModel";
import { withLimitConfirmation } from "@/model/LimitUi";
import {
  useFormula,
  useProp,
  exists,
  Box,
  Prop,
  popPage,
  Button,
  Card,
  Field,
  Label,
  NumField,
  Row,
  mdColors,
  Txt,
  pushPage,
  FloatSort,
  Dialog,
} from "miwi";

export const openCreateFuelTypeDialog = (props: {
  onCreate?: (newObject: FuelType) => void;
}) =>
  withLimitConfirmation({
    count: FuelType.limit.count,
    limit: FuelType.limit.max,
    labelSingular: `Fuel Type`,
    labelPlural: `Fuel Types`,
    action: () => pushPage(CreateFuelTypeDialog, props),
  });

function CreateFuelTypeDialog(props: {
  onCreate?: (newObject: FuelType) => void;
}) {
  const name = useProp(``) as Prop<string>;
  const rate = useProp(null) as Prop<number | null>;

  const computedFuelType = useFormula(() => {
    return {
      name: name.value,
      rate: rate.value,
    };
  });

  const fuelTypeIsValid = useFormula(() => {
    return FuelType.isValid(computedFuelType.value);
  });

  return (
    <Dialog>
      <Txt h1>Create Fuel Type</Txt>
      {/* TODO Doest it need autofocus like other cards (for consistency)? */}
      <Label label="Name" widthGrows>
        <Field
          value={name}
          hintText="Unnamed"
          underlined
          capitalize={"words"}
          keyboard={"text"}
          hasFocus={useProp(true)}
        />
      </Label>
      <Label label="Rate" widthGrows>
        <NumField
          negativesAreAllowed={false}
          underlined
          value={rate}
          hint="$/gal."
        />
      </Label>
      <Row padBetween={1}>
        <Button widthGrows outlined onClick={popPage}>
          Cancel
        </Button>
        <Button
          widthGrows
          onClick={() => {
            if (!fuelTypeIsValid.value) return;
            popPage();
            const createdPosix = Date.now();
            const newFuelType = FuelType.create({
              ...computedFuelType.value,
              createdPosix: createdPosix,
              _sortPos: FloatSort.getNewEndPos({
                list: FuelType.sortedFuelTypes,
                getPos: (fuelType) => fuelType.sortPos,
                getUid: (fuelType) => fuelType.docId,
              }),
            });
            if (exists(props.onCreate)) props.onCreate(newFuelType);
          }}
          fill={fuelTypeIsValid.value ? mdColors.green : mdColors.grey}
        >
          Create
        </Button>
      </Row>
    </Dialog>
  );
}
