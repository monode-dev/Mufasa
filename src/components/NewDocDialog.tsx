import {
  Button,
  Dialog,
  Field,
  Row,
  Txt,
  exists,
  popPage,
  theme,
  useProp,
} from "miwi";
import { Show } from "solid-js";
// import { LimitText, shouldShowWarning } from "./LimitUi";

export function NewDocDialog<T>(props: {
  label: string;
  create: (name: string) => T;
  pushPage?: (doc: T) => void;
  alreadyUsedNames?: string[];
  docCount: number;
  docLimit: number;
}) {
  const name = useProp("");
  const nameFieldHasFocus = useProp(true);
  const errorText = useProp("");

  return (
    <Dialog>
      <Txt h2 singleLine widthGrows alignCenter>{`New ${props.label}`}</Txt>
      <Field
        underlined
        hintText={`Enter ${props.label} Name`}
        value={name}
        hasFocus={nameFieldHasFocus}
      />
      <Show when={errorText.value.trim().length > 0}>
        <Txt scale={1 * 0.95} alignLeft widthGrows stroke={theme.palette.error}>
          {errorText.value}
        </Txt>
      </Show>
      {/* <Show
        when={shouldShowWarning({
          limit: props.docLimit,
          count: props.docCount,
        })}
      >
        <LimitText
          count={props.docCount}
          limit={props.docLimit}
          labelSingular={props.label}
          labelPlural={`${props.label}s`}
        />
      </Show> */}
      <Row widthGrows padBetween={1}>
        <Button outlined widthGrows onClick={popPage}>
          Cancel
        </Button>
        <Button
          widthGrows
          onClick={async () => {
            if (name.value.trim().length === 0) {
              errorText.value = `Please enter a name.`;
              // TODO: Focus the name field
              return;
            }
            const similarName = props.alreadyUsedNames?.find(
              (n) => n.trim().toLowerCase() === name.value.trim().toLowerCase(),
            );
            if (exists(similarName)) {
              errorText.value = `A ${props.label.toLowerCase()} named "${similarName}" already exists.`;
              // TODO: Focus the name field
              return;
            }
            if (props.docCount >= props.docLimit) {
              errorText.value = `You've reached your limit of ${props.label.toLowerCase()}s.`;
              return;
            }
            const newDoc = props.create(name.value);
            popPage();
            requestAnimationFrame(() => props.pushPage?.(newDoc));
          }}
        >
          Create
        </Button>
      </Row>
    </Dialog>
  );
}
