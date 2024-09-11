import { Box, Dialog, Txt, useProp } from "miwi";
import ShapeSelector from "./ShapeSelector";
import { TankShapeId } from "./ShapeUtils";

export function ShapeInfoDialog(props: { shapeId?: TankShapeId }) {
  const selectedShape = useProp(props.shapeId ?? null);
  return (
    <Dialog>
      <ShapeSelector label="Shape" value={selectedShape} hideActionButtons />
      <Box height={15} />
    </Dialog>
  );
}
