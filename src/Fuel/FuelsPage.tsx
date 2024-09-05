import {
  useProp,
  Box,
  Txt,
  Row,
  Icon,
  SortableColumn,
  FloatSort,
  Prop,
  EnterKeyHint,
} from "miwi";
import { SimplePage } from "@/components/SimplePage";
import { SimpleBody } from "@/components/SimpleBody";
import { For, Show } from "solid-js";
import { FuelType } from "@/model/DataModel";
import { mdiPlus } from "@mdi/js";
import { openCreateFuelTypeDialog } from "@/Fuel/CreateFuelTypeDialog";
import FuelTypeEntry from "@/Fuel/FuelTypeEntry";
import { InlineAppBar } from "@/components/InlineAppBar";

export function FuelsPage() {
  const fieldRefs: Prop<Map<number, HTMLDivElement>> = useProp(new Map());
  // filled in enterKey() function in FuelTypeEntry.tsx
  const enterHintRefs: Prop<Map<number, EnterKeyHint>> = useProp(new Map());

  return (
    <SimplePage>
      <InlineAppBar
        name={`Fuels`}
        right={
          <Icon
            /* TODO Is newObject in CreateFuelTypeDialog optional here? */
            iconPath={mdiPlus}
            scale={1.25}
            onClick={() => openCreateFuelTypeDialog({})}
          />
        }
      />

      <SimpleBody>
        <Show
          when={FuelType.sortedFuelTypes.length > 0}
          fallback={
            // Hints
            <Txt hint widthGrows alignCenter>
              No Fuels
            </Txt>
          }
        >
          {/* Header */}
          <Row widthGrows padBetween={1} alignLeft>
            <Txt bold widthGrows>
              Name
            </Txt>
            <Txt align={$Align.centerRight} width={5} bold>
              Rate $/Gal.
            </Txt>
            <Box width={1} />
          </Row>

          {/* Fuels */}
          <SortableColumn
            onSort={(props) =>
              FloatSort.moveItem({
                sortedList: FuelType.sortedFuelTypes,
                fromIndex: props.from,
                toIndex: props.to,
                getPos: (fuelTypes) => fuelTypes.sortPos,
                setPos: (fuelTypes, pos) => (fuelTypes.sortPos = pos),
              })
            }
          >
            <For
              each={FuelType.sortedFuelTypes}
              fallback={<Txt hint>Tap + to add Fuel Types.</Txt>}
            >
              {(fuelType, index) => {
                const dex = index();
                const next = dex + 1;
                const nextFuelType =
                  next < FuelType.sortedFuelTypes.length
                    ? FuelType.sortedFuelTypes[next]
                    : undefined;
                return (
                  <FuelTypeEntry
                    fuelType={fuelType}
                    nextFuelType={nextFuelType}
                    enterHintRefs={enterHintRefs}
                    fieldRefs={fieldRefs}
                    subDeliveryIndex={useProp(dex)}
                  />
                );
              }}
            </For>
          </SortableColumn>
        </Show>
      </SimpleBody>
    </SimplePage>
  );
}
