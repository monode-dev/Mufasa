/**
 * This is a hack to get around a few issues including:
 * Miwi Field Component is not bubbling up a number of events like onKey*, onBlur, onSubmit, onLoad* etc.
 * A final type could probably be in a Component like FieldGroup
 * that can handle wrapping multiple Fields and NumFields as in case ClientFields.
 * There are a number of For loop variants that need the Group to be built one at a time as in case TankFields.
 * The code would likely be simpler if it were a feature of Miwi.
 */

import {
  Box,
  BoxProps,
  EnterKeyHint,
  FieldCapitalization,
  FieldInputType,
  FormatFieldInput,
  KeyboardType, Overflow,
  Prop,
} from "miwi";
import {JSX} from "solid-js/jsx-runtime";
import {children} from "solid-js";

export type SharedFieldProps = BoxProps & {
  onlyWriteOnBlur?: boolean;
  hintColor?: string;
  scale?: number;
  enterKeyHint?: EnterKeyHint;
  onBlur?: () => void;
  keyboard?: KeyboardType;
  underlined?: boolean;
}

export type FieldProps = SharedFieldProps & {
  value?: Prop<string>;     // type conflict
  iconPath?: string;        // different name
  hintText?: string;        // different name
  hasFocus?: Prop<boolean>; // different name
  maxLines?: number;
  multiline?: boolean;
  h1?: boolean;
  h2?: boolean;
  capitalize?: FieldCapitalization;
  inputType?: FieldInputType;
  validateNextInput?: (nextInput: string) => boolean;
  formatInput?: FormatFieldInput;
};

export type NumFieldProps = SharedFieldProps & {
  value?: Prop<number | null | undefined>; // type conflict
  icon?: string;                           // different name
  hint?: string;                           // different name
  hasFocusSig?: Prop<boolean>;             // different name
  negativesAreAllowed?: boolean;
  title?: boolean;
  heading?: boolean;
};

/** Use the handler in a global event listener to handle enter key presses.
 * The listener should only be active on the page that contains the indexed fields.
 */
export function IndexedFieldKeyHandler(
  event: KeyboardEvent,
  fieldRefs: Prop<Map<number, HTMLDivElement>>,
  enterHintRefs: Prop<Map<number, EnterKeyHint>>
) {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    const parent = target.closest("[data-index]") as HTMLElement;
    const index = parent?.dataset.index;

    if (index !== undefined) {
      const fields = fieldRefs.value;
      const currentIndex = parseInt(index, 10);
      // storing index starts at 1
      const lastIndex = fields.size;
      if (currentIndex > -1 && currentIndex < lastIndex) {
        const enterHint = enterHintRefs.value.get(currentIndex);
        if ((enterHint ?? 'done') == `done`) return;

        const nextElement = fields.get(currentIndex + 1);
        console.log("nextElement: ", nextElement);
        if (nextElement) {
          const nextField = nextElement.querySelector('input, select, textarea') as HTMLElement;
          if (nextField) {
            nextField.focus();
            event.preventDefault(); // Prevent form submission
          }
        }
      }
    }
  }
}

// Hypothesis: type Field | NumField is causing an error because of the value type conflict
// No clue why only type Field by itself is causing an error
interface IndexedProps extends SharedFieldProps{
  count: Prop<number>;
  refs: Prop<Map<number,HTMLDivElement>>;
  indexRef: Prop<number>;
  children: JSX.Element; // & { type: typeof Field | typeof NumField };
}

/**
 * Each tab-able Field or NumField should be wrapped in an IndexedField.
 */
export function IndexedField(props: IndexedProps) {

  function assignRef(el: HTMLDivElement | null, counter: Prop<number>, fieldRefs: Prop<Map<number,HTMLDivElement>>) {
    console.log("assignRef: ", el, counter);
    if (el) {
      const index = ++counter.value;
      fieldRefs.value.set(index, el);
      props.indexRef.value = index;
    }
    return el;
  }

  return (
    <Box
      ref={(el) => assignRef(el, props.count, props.refs)}
      data-index={props.indexRef.value}
      widthGrows
      // height={fieldHeight.value}
      stroke={$theme.colors.text}
      padBetweenX={0.25}
      padBetweenY={0}
      overflowY={$Overflow.spill}
      alignTopLeft
      overrideProps={props}
      overrideOverrides={{
        // scale: scale.value,
        overflowX: Overflow.crop,
      }}>
      {props.children}
    </Box>
  );
}


export function FieldKeyHandler(event: KeyboardEvent) {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    // enterKeyHint stuff is broken
    // const field = event.target as unknown as KeyFieldProps;
    // const enterKeyHint = field.enterKeyHint;
    // if (enterKeyHint === 'done') return;
    // if (enterKeyHint === 'next')
    {
      const form = document;
      if (form) {
        const focusableElements = Array.from(
          form.querySelectorAll<HTMLElement>(
            'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled'));
        const index = focusableElements.indexOf(target);
        if (index > -1 && index < focusableElements.length - 1) {
          const nextElement = focusableElements[index + 1];
          nextElement.focus();
          event.preventDefault(); // Prevent form submission
        }
      }
    }
  }
}
