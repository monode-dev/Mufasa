import TankSelector from "@/Tanks/TankSelector";
import { Label, Prop, Txt, exists } from "miwi";
import { Show, createEffect } from "solid-js";
import ClientSelector from "./ClientSelector";
import { Tank } from "@/Tanks/Tank";
import { Client } from "./Client";

export function ClientAndTankSelector(
  props: Readonly<{
    client: Prop<Client | null | undefined>;
    tank: Prop<Tank | null | undefined>;
    showNewOption?: boolean;
    showJustFuelOption?: boolean;
  }>,
) {
  createEffect(() => {
    const tankIsChildOfClient = [...(props.client.value?.tanks ?? [])].some(
      (tank) => {
        return (
          exists(tank.docId) &&
          exists(props.tank.value?.docId) &&
          tank.docId === props.tank.value?.docId
        );
      },
    );
    if (!tankIsChildOfClient) {
      props.tank.value = null;
    }
  });
  function isClientDeleted() {
    return props.client.value?.isDeleted;
  }
  return (
    <>
      <Label label="Client" stroke={isClientDeleted() ? $theme.colors.warning : undefined}>
        <ClientSelector
          value={props.client}
          showOneTimeOption={false}
          showNewOption={true}
          showCancelOption={true}
        />
      </Label>
      {/* TODO: Show special text when there are no tanks to pick from.*/}
      <Show when={exists(props.client.value) && !isClientDeleted()}>
        {/* TODO: check the value typelogic  */}
        <Label label="Tank">
          <TankSelector
            value={props.tank}
            client={props.client.value!}
            showNewOption={props.showNewOption ?? false}
            showJustFuelOption={props.showJustFuelOption ?? false}
          />
        </Label>
      </Show>
      <Show when={isClientDeleted()}>
        <Txt stroke={$theme.colors.warning} widthGrows>
          This client has been deleted.
        </Txt>
      </Show>
    </>
  );
}
