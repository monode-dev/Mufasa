import { Field, Icon, Prop, Row, Txt, theme, useFormula, useProp } from "miwi";
import { HiddenOption, HiddenOptions } from "./HiddenOptions";
import { Show } from "solid-js";
import { mdiCheck } from "@mdi/js";

export function SimpleDocEntry(
  props: {
    onClick?: () => void;
    unnamedText: string;
    deleteText?: string;
    onDelete: () => void;
  } & (
    | {
        renamable: true;
        name: Prop<string | null | undefined>;
        hintText: string;
      }
    | {
        renamable?: false;
        name: string | null | undefined;
      }
  ),
) {
  const name = useFormula(
    () => (props.renamable ? props.name.value : props.name) ?? ``,
    (v) => (props.renamable ? (props.name.value = v) : undefined),
  );
  const isEmpty = useFormula(() => name.value.trim() === ``);
  const isEditing = useProp(false);
  const tempName = useProp(``);
  return (
    <Row widthGrows onClick={props.onClick} height={1} overflowYSpills>
      <Show
        when={isEditing.value}
        fallback={
          <>
            <Txt
              singleLine
              widthGrows
              alignCenterLeft
              stroke={isEmpty.value ? theme.palette.warning : undefined}
            >
              {isEmpty.value ? props.unnamedText ?? `Unnamed!` : name.value}
            </Txt>
            <HiddenOptions>
              <Show when={props.renamable}>
                <HiddenOption
                  text={`Rename`}
                  onClick={() => {
                    isEditing.value = true;
                  }}
                />
              </Show>
              <HiddenOption
                text={props.deleteText ?? `Delete`}
                stroke={theme.palette.error}
                onClick={props.onDelete}
              />
            </HiddenOptions>
          </>
        }
      >
        <Field
          widthGrows
          alignCenterLeft
          value={name}
          tempValue={tempName}
          hasFocus={isEditing}
        />
        <Icon
          iconPath={mdiCheck}
          stroke={theme.palette.primary}
          onClick={() => (isEditing.value = false)}
        />
      </Show>
    </Row>
  );
}
