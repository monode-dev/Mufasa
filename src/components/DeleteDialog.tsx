import { Box, Button, Card, Row, Txt, popPage, useProp } from "miwi";

export default function DeleteDialog(props: { obj: Object; message: string }) {
  const cardRef = useProp<HTMLDivElement | null>(null);

  function closePopUp() {
    popPage();
  }

  interface ObjectWithDeleteDoc {
    deleteDoc: () => void;
  }
  function handleYes() {
    closePopUp();
    doDelete();
  }
  
  function doDelete(){
    const objWithDelete = props.obj as ObjectWithDeleteDoc;
    console.log("Cast props.obj to ObjectWithDeleteDoc", objWithDelete);
    objWithDelete.deleteDoc();
    console.log("ObjectWithDeleteDoc Deleted");
  }

  function popOnClickOutside(e: MouseEvent) {
    if (!cardRef.value?.contains(e.target as Node)) {
      popPage();
      e.stopPropagation();
    }
  }

  return (
    <Box widthGrows heightGrows fill="#00000099">
      {/* TRY get element by id */}
      <Card
        ref={(el) => {
          cardRef.value = el;
        }}
        width={`75%`}
        shadowSize={0}
      >
        <Txt heightShrinks widthGrows overflowX={$Overflow.wrap}>
          {props.message}
        </Txt>
        <Row widthGrows align={$Align.spaceEvenly}>
          <Button outlined onClick={handleYes}>
            Yes
          </Button>
          <Button onClick={closePopUp}>No</Button>
        </Row>
      </Card>
    </Box>
  );
}
