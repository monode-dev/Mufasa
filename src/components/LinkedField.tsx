import {Box, Overflow, Prop} from "miwi";
import {IndexedProps} from "./IndexedField";

export function LinkedField(props: IndexedProps) {
  function assignRef(el: HTMLDivElement, refs: Prop<Map<number, HTMLDivElement>>) {
        throw new Error("Function not implemented.");
    }

  return (
    <Box
      ref={(el) => assignRef(el, props.refs)}
      data-index={props.index.value}
      widthGrows
      stroke={$theme.colors.text}
      padBetweenX={0.25}
      padBetweenY={0}
      overflowY={$Overflow.spill}
      alignTopLeft
      overrideProps={props}
      overrideOverrides={{
        overflowX: Overflow.crop,
      }}>
      {props.children}
    </Box>
  );
}