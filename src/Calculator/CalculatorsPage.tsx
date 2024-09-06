import {
  Txt,
  Card,
  Row,
  Column,
  Box,
  Label,
  NumField,
  doWatch,
  roundToString,
  useFormula,
  exists,
  pushPage,
  useProp,
  Selector,
  Slider,
  theme,
  Icon,
  Prop,
  HiddenOption,
  Button,
} from "miwi";
import { For, Show } from "solid-js";
import {
  calcGallonsToReachPercent,
  createReactiveTankGeometry,
  getTankShape,
} from "@/Calculator/ShapeUtils";
import { formatNumWithCommas } from "@/utils";
import CompleteSubDeliveryDialog from "@/Deliveries/CompleteSubDeliveryDialog";
import TankFields from "@/Tanks/TankFields";
import { ClientAndTankSelector } from "@/Clients/ClientAndTankSelector";
import { Delivery, SubDelivery } from "@/Deliveries/Delivery";
import { Client } from "@/Clients/Client";
import { Tank } from "@/Tanks/Tank";
import { mdiPencil } from "@mdi/js";
import { EditDeliveryPage } from "@/Deliveries/EditDeliveryPage";
import { SimplePage } from "@/components/SimplePage";
import { InlineAppBar } from "@/components/InlineAppBar";
import { SimpleBody } from "@/components/SimpleBody";
import { CalculateFillFields } from "./CalculateFillFields";

export function CalculatorsPage() {
  return (
    <SimplePage>
      <InlineAppBar name="Calculate Fill" padBottom={0.5} />
      <SimpleBody
        /* We need to pad the top to give room for the shadow. */
        padTop={0.5}
      >
        <Card widthGrows>
          <CalculateFillFields />
        </Card>
      </SimpleBody>
    </SimplePage>
  );
}
