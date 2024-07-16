import { Box, Field, Txt, useProp, Card, useFormula, Prop } from "miwi";
import { Show } from "solid-js";

type AddressState = (typeof AddressState)[keyof typeof AddressState];
const AddressState = {
  expanded: `expanded`,
  editing: `editing`,
};

export function AddressField(props: {
  address: Prop<string>;
  isJustCreated: boolean;
  hintText?: { value: string };
}) {
  const addressState = useProp<AddressState>(
    props.isJustCreated ? AddressState.editing : AddressState.expanded,
  );
  const textSig = useFormula(
    () => props.address.value ?? ``,
    (val) => (props.address.value = val),
  );
  return (
    <Box widthGrows>
      <Card
        stack
        alignTopLeft
        pad={0}
        scale={1}
        widthGrows
        minHeight={1}
        overflowYCrops
        shadowSize={0}
        outlineSize={0}
        outlineColor={`transparent`}
        fill={`00000000`}
      >
        <Txt
          alignTopLeft
          stroke={`transparent`}
          overflowXWraps
          widthGrows
          overflowYCrops
        >
          {textSig.value === ``
            ? `a`
            : textSig.value.endsWith(`\n`)
              ? textSig.value + `\n`
              : textSig.value}
        </Txt>
        <Show when={true || addressState.value === AddressState.editing}>
          {/* TODO: Disable when not in editing mode. */}
          <Field
            hintText={props.hintText?.value ?? ``}
            widthGrows
            asTallAsParent
            overflowXWraps
            alignTopLeft
            maxLines={100}
            hasFocus={useFormula(
              () => addressState.value === AddressState.editing,
              (isEditing) =>
                (addressState.value = isEditing
                  ? AddressState.editing
                  : AddressState.expanded),
            )}
            value={textSig}
          />
        </Show>
      </Card>
    </Box>
  );
}
