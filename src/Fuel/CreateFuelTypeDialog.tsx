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
} from "miwi";

export const openCreateFuelTypeDialog = (props: {
  onCreate?: (newObject: FuelType) => void;
}) => 
  withLimitConfirmation({
    count: FuelType.limit.count,
    limit: FuelType.limit.max,
    labelSingular: `Fuel Type`,
    labelPlural: `Fuel Types`,
    action: () =>
      pushPage(CreateFuelTypeDialog, props),
  });

function CreateFuelTypeDialog(props: {
  onCreate?: (newObject: FuelType) => void;
}) {
  // Assign prop defaults
  props.onCreate = props.onCreate ?? undefined;

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

  function handleYes() {
    if (!fuelTypeIsValid.value) return;
    popPage();
    const newFuelType = FuelType.create({
      ...computedFuelType.value,
      createdPosix: Date.now(),
    });
    if (exists(props.onCreate)) props.onCreate(newFuelType);
  }

  return (
    <Box
      onClick={popPage}
      widthGrows
      heightGrows
      fill="#00000099"
      bonusTouchArea={false}
    >
      <Card width="75%" shadowSize={0} preventClickPropagation>
        <Txt h1>Create Fuel Type</Txt>
        {/* TODO Doest it need autofocus like other cards (for consistency)? */}
        <Label label="Name" widthGrows>
          <Field value={name} hintText="Unnamed" underlined />
        </Label>
        <Label label="Rate" widthGrows>
          <NumField
            negativesAreAllowed={false}
            underlined
            valueSig={rate}
            hint="$/gal."
          />
        </Label>
        <Row widthGrows align={$Align.spaceEvenly}>
          <Button outlined onClick={popPage}>
            Cancel
          </Button>
          <Button
            onClick={handleYes}
            fill={fuelTypeIsValid.value ? mdColors.green : mdColors.grey}
          >
            Create
          </Button>
        </Row>
      </Card>
    </Box>
  );
}
