import { Button, Dialog, Row, Txt, popPage } from "miwi";
import { Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export function ConfirmationPopUp(props: {
  text?: string;
  children?: JSX.Element;
  yesText?: string;
  onYes?: () => void;
  onNo?: () => void;
}) {
  return (
    <Dialog>
      <Show
        when={props.children}
        fallback={<Txt scale={1}>{props.text ?? `Are you sure?`}</Txt>}
      >
        {props.children}
      </Show>
      <Row padBetween={1}>
        <Button
          outlined
          widthGrows
          onClick={() => {
            props.onNo?.();
            popPage();
          }}
        >
          Cancel
        </Button>
        <Button
          // outlined
          widthGrows
          onClick={() => {
            props.onYes?.();
            popPage();
          }}
        >
          {props.yesText ?? `Do It`}
        </Button>
      </Row>
    </Dialog>
  );
}
