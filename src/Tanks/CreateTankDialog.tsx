import {
  popPage,
  useFormula,
  useProp,
  exists,
  Prop,
  Txt,
  Field,
  Row,
  Button,
  FloatSort,
  doWatch,
  pushPage,
  Dialog,
} from "miwi";
import { isTankValid } from "@/AppData";
import { createReactiveTankGeometry } from "@/Calculator/ShapeUtils";
import TankFields from "./TankFields";
import { FuelTypeSelector } from "@/Fuel/FuelTypeSelector";
import { mdiLabel } from "@mdi/js";
import { Show } from "solid-js";
import { Client } from "@/Clients/Client";
import { Tank } from "./Tank";
import { FuelType } from "@/model/DataModel";
import { withLimitConfirmation } from "@/model/LimitUi";

export const openCreateTankDialog = (props: {
  client: Client;
  onCreate?: (newTank: Tank) => void | undefined;
}) =>
  withLimitConfirmation({
    count: Tank.limit.count,
    limit: Tank.limit.max,
    labelSingular: `Tank`,
    labelPlural: `Tanks`,
    action: () => pushPage(CreateTankDialog, props),
  });

function CreateTankDialog(props: {
  client: Client;
  onCreate?: (newTank: Tank) => void | undefined;
}) {
  const notes = useProp("") as Prop<string>;
  const tankGeometry = createReactiveTankGeometry();
  const show_errors = useProp(false);
  const tankIsValid = useProp(false);
  const fuelType = useProp(null) as Prop<FuelType | null>;
  const live_error_msg = useFormula(
    () => !tankIsValid.value && show_errors.value,
  );
  const fuel_warn_message = useFormula(() => {
    if (show_errors.value) {
      if (!exists(fuelType.value)) {
        return "Please select a fuel type.";
      }
    }
  });

  const computedTank = useFormula(
    () =>
      ({
        fuelType: fuelType.value,
        ...tankGeometry,
        notes: notes.value,
        sortPos: FloatSort.getNewEndPos({
          list: props.client.tanks ?? [],
          getPos: (tank) => tank.sortPos,
          getUid: (tank) => tank.docId,
        }),
      } satisfies Partial<Tank>),
  );

  function showErrors() {
    show_errors.value = true;
  }

  doWatch(() => {
    tankIsValid.value = isTankValid(computedTank.value);
  });

  const TankFields_warning = useProp("");
  const showWarning = useFormula(
    () => exists(TankFields_warning.value) || exists(fuel_warn_message.value),
  );

  const warningMessage = useFormula(() => {
    if (exists(fuel_warn_message.value) && show_errors.value) {
      return fuel_warn_message.value;
    }
    if (exists(TankFields_warning.value) && show_errors.value) {
      return TankFields_warning.value;
    }
  });

  return (
    <Dialog>
      <Txt h1>Create Tank</Txt>
      {/* Fuel Selector */}
      <Row>
        <Txt>Fuel: </Txt>
        <FuelTypeSelector
          hideIcon
          fuelType={fuelType}
          showNewOption={true}
          show_errors={show_errors}
        />
      </Row>
      {/* Shape Selector conditionally renders Tank Fields */}
      <TankFields
        create
        tankGeometry={tankGeometry}
        oneDimPerRow
        warningMessage={TankFields_warning}
      />
      {/* Notes */}
      <Field
        value={notes}
        hintText="Notes, Combination, Key Tag"
        iconPath={mdiLabel}
        underlined
        multiline
        capitalize={"sentences"}
        keyboard={"text"}
      />

      <Show when={showWarning}>
        <Txt widthGrows stroke={$theme.colors.warning}>
          {warningMessage.value}
        </Txt>
      </Show>

      {/* Cancel and Create Buttons */}
      <Row>
        <Button widthGrows outlined onClick={popPage}>
          Cancel
        </Button>
        <Button
          widthGrows
          onClick={() => {
            if (!tankIsValid.value) {
              showErrors();
              return;
            }
            popPage();
            if (!exists(props.client.tanks)) return;
            const newTank = Tank.create({
              ...computedTank.value,
              mx_parent: props.client,
              creationTimePosix: Date.now(),
            });
            if (exists(props.onCreate)) props.onCreate(newTank);
          }}
          fill={$theme.colors.primary}
        >
          Create
        </Button>
      </Row>
    </Dialog>
  );
}
