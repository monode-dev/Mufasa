import { SIZE_SHRINKS, Txt, useFormula, Overflow } from "miwi";

export default function ShowNotes(props: {
  notes: string | null | undefined;
  shouldShowFullNotes?: boolean;
  hint?: boolean;
}) {
  const notes = useFormula(() => props.notes?.trim() ?? ``);
  return (
      <Txt
        hint={props.hint}
        widthGrows
        alignBottomLeft
        height={props.shouldShowFullNotes ? SIZE_SHRINKS : 1}
        overflowX={props.shouldShowFullNotes ? Overflow.wrap : Overflow.crop}
      >
        Notes: {notes.value}
      </Txt>
  );
}
