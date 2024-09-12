import { Box, Dialog, exists, Txt, useProp } from "miwi";
import ShapeSelector from "./ShapeSelector";
import { getTankShape, TankShapeId } from "./ShapeUtils";

export function ShapeInfoDialog(props: { shapeId?: TankShapeId }) {
  const selectedShape = useProp(props.shapeId ?? null);
  return (
    <Dialog>
      <ShapeSelector label="Shape" value={selectedShape} hideActionButtons />

      <div
        style={{
          width: `100%`,
          "aspect-ratio": `1`,
        }}
      >
        <Box
          widthGrows
          heightGrows
          fill={
            exists(selectedShape.value)
              ? getTankShape(selectedShape.value)!.diagramImage
              : undefined
          }
        />
      </div>
    </Dialog>
  );
}
