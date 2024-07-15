import TankFields from "@/Tanks/TankFields";
import {
  Card,
  Field,
  HiddenDelete,
  Row,
  Txt,
  exists,
  pushPage,
  useFormula,
} from "miwi";
import DeleteDialog from "@/components/DeleteDialog";
import { FuelTypeSelector } from "@/Fuel/FuelTypeSelector";
import { mdiLabel } from "@mdi/js";
import { FuelType } from "@/model/DataModel";
import { Tank } from "./Tank";

export default function TankEntry(props: Readonly<{ tank: Tank }>) {
  return (
    <Card widthGrows heightGrows>
      <Row>
        <Txt
          stroke={
            exists(props.tank.fuelType) ? undefined : $theme.colors.warning
          }
        >
          Fuel:{" "}
        </Txt>
        <FuelTypeSelector
          hideIcon
          fuelType={useFormula(
            () => props.tank.fuelType ?? null,
            (newValue: FuelType | null) => {
              props.tank.fuelType = newValue;
            },
          )}
          showNewOption={true}
        />
        <HiddenDelete
          onDelete={() => {
            pushPage(DeleteDialog, {
              obj: props.tank,
              message: `Are you sure you want to permanently delete this tank? Associated deliveries will NOT be deleted.`,
            });
          }}
        />
      </Row>
      <TankFields tankGeometry={props.tank} />
      <Field
        value={useFormula(
          () => props.tank.notes ?? "",
          (newValue: string) => {
            props.tank.notes = newValue;
          },
        )}
        hintText="Notes"
        iconPath={mdiLabel}
        underlined
      />
    </Card>
  );
}
