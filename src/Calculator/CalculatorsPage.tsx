import { Card } from "miwi";
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
