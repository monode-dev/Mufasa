import { isTankValid } from "@/AppData";
import { FuelTypeSelector } from "@/Fuel/FuelTypeSelector";
import {
  Txt,
  Row,
  useFormula,
  pushPage,
  Card,
  Label,
  Field,
  Column,
  exists,
  HiddenOptions,
  DeleteOption,
  theme,
  DeleteDialog,
  useProp,
} from "miwi";
import TankFields from "./TankFields";
import { Client } from "@/Clients/Client";
import { Tank } from "./Tank";
import { Show } from "solid-js";

export function TankCard(props: Readonly<{ tank: Tank; client: Client }>) {
  const warningMessage = useProp<string | null>(null);
  return (
    <Card padBetween={0.75} preventClickPropagation>
      <Row widthGrows alignTopLeft padBetween={0.5}>
        {/* tankDisplayName (tank, amount Of Note Characters) */}
        <Txt widthGrows>
          {props.tank.getLabel({
            excludeParts: [`notes`],
          })}
        </Txt>
        <HiddenOptions
          cancelOptions={{
            stroke: theme.palette.hint,
          }}
        >
          <DeleteOption
            onClick={() =>
              pushPage(DeleteDialog, {
                onDelete: () => props.tank.deleteDoc(),
                message: `Are you sure you want to delete this tank?`,
              })
            }
          />
        </HiddenOptions>
      </Row>
      <Label
        label={`Fuel`}
        stroke={exists(props.tank.fuelType) ? undefined : $theme.colors.warning}
      >
        <FuelTypeSelector
          hideIcon
          showNewOption
          fuelType={useFormula(
            () => props.tank.fuelType,
            (val) => (props.tank.fuelType = val),
          )}
        />
      </Label>
      <Column padBetween={0.5}>
        <TankFields
          create
          tankGeometry={props.tank}
          warningMessage={warningMessage}
        />
        <Label label={`Notes`}>
          <Field
            hintText={`Add Notes`}
            underlined
            multiline
            value={useFormula(
              () => props.tank.notes ?? ``,
              (val) => (props.tank.notes = val),
            )}
            onlyWriteOnBlur
          />
        </Label>
      </Column>

      <Show when={exists(warningMessage.value)}>
        <Txt widthGrows stroke={$theme.colors.warning}>
          {warningMessage.value}
        </Txt>
      </Show>
    </Card>
  );
}
