import { Card, Dialog, Page, Prop, Txt, popPage } from "miwi";
import { TankShapeId } from "./ShapeUtils";

export default function ShapeHelpDialog(props: {
  shape: Prop<TankShapeId | null | undefined>;
}) {
  return (
    <Dialog>
      <Txt hint>Shape Diagrams Coming Soon</Txt>
    </Dialog>
  );
}
