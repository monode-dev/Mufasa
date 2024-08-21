/**
 * This is a hack to get around a few issues.
 * Miwi Field Component is not bubbling up a number of events like onKey*, onBlur, onSubmit, onLoad* etc.
 * A final type should probably be in a Component like FieldGroup.
 * The code would likely be simpler if it were a feature of Miwi.
 */

/** Use the handler in a global event listener to handle enter key presses.
 * The listener should only be active on the page that contains the indexed fields.
 */

import {
  BoxProps,
  EnterKeyHint,
  Field,
  FieldCapitalization,
  FieldInputType,
  FormatFieldInput,
  KeyboardType, NumField,
  Prop, useProp
} from "miwi";
import {JSX} from "solid-js/jsx-runtime";

export type SharedFieldProps = {
  onlyWriteOnBlur?: boolean;
  hintColor?: string;
  scale?: number;
  enterKeyHint?: EnterKeyHint;
  onBlur?: () => void;
  keyboard?: KeyboardType;
  underlined?: boolean;
}

export type FieldProps = SharedFieldProps & BoxProps & {
  value?: Prop<string>;
  iconPath?: string;
  hintText?: string;
  hasFocus?: Prop<boolean>;
  maxLines?: number;
  multiline?: boolean;
  h1?: boolean;
  h2?: boolean;
  capitalize?: FieldCapitalization;
  inputType?: FieldInputType;
  validateNextInput?: (nextInput: string) => boolean;
  formatInput?: FormatFieldInput;
};

export type NumFieldProps = SharedFieldProps & BoxProps & {
  value?: Prop<number | null | undefined>;
  icon?: string;
  hint?: string;
  hasFocusSig?: Prop<boolean>;
  negativesAreAllowed?: boolean;
  title?: boolean;
  heading?: boolean;
};

interface IndexedFieldProps
  // extends Partial<FieldProps & NumFieldProps>
{
  static_counter: number;
  fieldRefs: HTMLDivElement[];
  children: JSX.Element & { type: typeof Field | typeof NumField };
}

export function IndexedFieldKeyHandler(event: KeyboardEvent) {
  if (event.key === "Enter") {
    const target = event.target as HTMLElement;
    const parent = target.closest("[data-index]") as HTMLElement;
    const index = parent?.dataset.index;

    if (index !== undefined) {
      const currentIndex = parseInt(index, 10);
      const fieldRefs = (parent as any).fieldRefs as HTMLDivElement[];
      if (currentIndex > -1 && currentIndex < fieldRefs.length - 1) {
        const nextElement = fieldRefs[currentIndex + 1];
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

export default function IndexedField(props: IndexedFieldProps) {
  let static_index_ref = useProp(-1);

  function assignRef(el: HTMLDivElement | null, counter: number, fieldRefs: HTMLDivElement[]) {
    if (el) {
      static_index_ref.value = ++counter;
      fieldRefs[static_index_ref.value] = el;
    }
    return el;
  }

  return (
    <div ref={(el) => assignRef(el, props.static_counter, props.fieldRefs)}
         data-index={static_index_ref.value}>
      {props.children}
    </div>
  );
}
