
import {EnterKeyHint, Field} from "miwi";

export interface KeyFieldProps {
  enterKeyHint?: EnterKeyHint;
}

export function IndexedFieldKeyHandler(event: KeyboardEvent) {
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

interface IndexedFieldProps extends KeyFieldProps {
  static_counter: number;
  static_index_ref: number;
}
let countIndex = 0;
const fieldRefs = new Array<HTMLDivElement>();

const IndexedField = (props: IndexedFieldProps) => {
  let ref: HTMLDivElement | undefined = undefined;

  function assignRef(el: HTMLDivElement | null, counter: number, fieldRefs: HTMLDivElement[]) {
    if (el) {
      props.static_index_ref = ++counter;
      fieldRefs[props.static_index_ref] = el;
    }
    return el;
  }

  return (
    <div ref={(el) => assignRef(el, countIndex, fieldRefs)}
         tabIndex={props.static_index_ref}>
      <Field {...props} />
    </div>
  );
};

export default IndexedField;