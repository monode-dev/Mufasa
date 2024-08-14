import { isTankValid } from "@/AppData";
import DeleteDialog from "@/components/DeleteDialog";
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
} from "miwi";
import TankFields from "./TankFields";
import { Client } from "@/Clients/Client";
import { Tank } from "./Tank";
import { HiddenOptions } from "@/components/HiddenOptions";

export function TankCard(props: Readonly<{ tank: Tank; client: Client }>) {
  return (
    <Card
      outlineSize={1 / 8}
      outlineColor={isTankValid(props.tank) ? undefined : $theme.colors.warning}
      padBetween={0.75}
      preventClickPropagation
    >
      <Row widthGrows alignTopLeft padBetween={0.5}>
        {/* tankDisplayName (tank, amount Of Note Characters) */}
        <Txt widthGrows>
          {props.tank.getLabel({
            excludeParts: [`notes`],
          })}
        </Txt>
        <HiddenOptions
          showIcons
          onDelete={() =>
            pushPage(DeleteDialog, {
              obj: props.tank,
              message: `Are you sure you want to delete this tank?`,
            })
          }
        />
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
        <TankFields tankGeometry={props.tank} />
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
    </Card>
  );
}
