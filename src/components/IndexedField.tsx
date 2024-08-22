/**
 * This is a hack to get around a few issues.
 * Miwi Field Component is not bubbling up a number of events like onKey*, onBlur, onSubmit, onLoad* etc.
 * A final type should probably be in a Component like FieldGroup
 * that can wrap multiple Fields and NumFields as in case ClientFields.
 * There are a number of For loop variants that need the Group to be added one at a time as in case TankFields.
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
  Prop, useFormula, useProp
} from "miwi";
import {JSX} from "solid-js/jsx-runtime";

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

interface IndexedProps extends SharedFieldProps{
  static_counter: Prop<number>;
  fieldRefs: Prop<Map<number,HTMLDivElement>>;
}

/** Use the handler in a global event listener to handle enter key presses.
 * The listener should only be active on the page that contains the indexed fields.
 */
export function IndexedFieldKeyHandler(event: KeyboardEvent) {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    const parent = target.closest("[data-index]") as HTMLElement;
    const index = parent?.dataset.index;
    const last = parent?.dataset.last;
    const fields = parent?.dataset.fields;
    console.log("index: ", index, "last: ", last, "fields: ", fields);

    if (index !== undefined && last !== undefined && fields !== undefined) {
      const currentIndex = parseInt(index, 10);
      const lastIndex = parseInt(last, 10);
      const fieldRefs = new Map<number, HTMLDivElement>(JSON.parse(fields));
      if (currentIndex > -1 && currentIndex < lastIndex) {
        const nextElement = fieldRefs.get(currentIndex + 1);
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
interface IndexedFieldProps extends IndexedProps {
  children: JSX.Element; // & { type: typeof Field | typeof NumField };
}

/**
 * Each tab-able Field or NumField should be wrapped in an IndexedField.
 */
export function IndexedField(props: IndexedFieldProps) {
  let static_index_ref = useProp(-1);

  function assignRef(el: HTMLDivElement | null, counter: Prop<number>, fieldRefs: Prop<Map<number,HTMLDivElement>>) {
    console.log("assignRef: ", el, counter);
    if (el) {
      static_index_ref.value = ++counter.value;
      fieldRefs.value.set(static_index_ref.value, el);
      console.log("fieldRefs: ", fieldRefs);
    }
    return el;
  }

  const fields = useFormula(() => JSON.stringify(Array.from(props.fieldRefs.value.entries())));
  return (
    <Box
      ref={(el) => assignRef(el, props.static_counter, props.fieldRefs)}
      data-index={static_index_ref.value}
      data-last={props.static_counter.value}
      data-fields={fields.value}
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
