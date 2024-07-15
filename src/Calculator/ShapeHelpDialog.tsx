import { Card, Page, Prop, Txt, popPage } from "miwi";
import { TankShapeId } from "./ShapeUtils";

export default function ShapeHelpDialog(props: {
  shape: Prop<TankShapeId | null | undefined>;
}) {
  return (
    <Page onClick={popPage} widthGrows heightGrows fill="#00000099">
      <Card width={17} height={14} shadowSize={0} preventClickPropagation>
        <Txt hint>Shape Diagrams Coming Soon</Txt>
      </Card>
    </Page>
  );
}
