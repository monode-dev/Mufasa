import { mdiClose, mdiDotsVertical, mdiTrashCanOutline } from "@mdi/js";
import {
  BoxProps,
  Icon,
  Modal,
  Prop,
  Row,
  Size,
  Txt,
  doNow,
  exists,
  closeParentModal,
  useFormula,
  useProp,
  theme,
} from "miwi";
import { Show } from "solid-js";

export function HiddenOptions(
  props: {
    icon?: string;
    hideCancel?: boolean;
    onDelete?: () => void;
    isOpen?: Prop<boolean>;
    cardStyle?: BoxProps;
    modalWidth?: Size;
    showIcons?: boolean;
  } & BoxProps,
) {
  const scale = props.scale ?? 1;
  const isOpen = doNow(() => {
    const _fallbackIsOpen = useProp(false);
    return useFormula(
      () => props.isOpen?.value ?? _fallbackIsOpen.value,
      (v) =>
        exists(props.isOpen)
          ? (props.isOpen.value = v)
          : (_fallbackIsOpen.value = v),
    );
  });
  return (
    <Modal
      openButton={
        <Icon
          scale={scale}
          iconPath={props.icon ?? mdiDotsVertical}
          onClick={() => (isOpen.value = !isOpen.value)}
        />
      }
      openButtonWidth={scale}
      openButtonHeight={scale}
      isOpen={isOpen}
      cardStyle={{
        cornerRadius: 0.5,
        zIndex: 2,
        ...props.cardStyle,
      }}
      modalWidth={props.modalWidth}
    >
      <Show when={!props.hideCancel}>
        <HiddenOption
          text={`Cancel`}
          icon={props.showIcons ? mdiClose : undefined}
        />
      </Show>
      {props.children}
      <Show when={exists(props.onDelete)}>
        <HiddenOption
          text={`Delete`}
          icon={props.showIcons ? mdiTrashCanOutline : undefined}
          onClick={props.onDelete}
          stroke={theme.palette.error}
        />
      </Show>
    </Modal>
  );
}

export function HiddenOption(
  props: {
    text?: string;
    icon?: string;
    autoHide?: boolean;
    singleLine?: boolean;
  } & BoxProps,
) {
  let optionElement: HTMLElement | null = null;
  return (
    <Row
      alignCenterLeft
      padBetween={0.25}
      getElement={(el) => (optionElement = el)}
      onClick={() => {
        if (!(props.autoHide ?? true)) return;
        if (!exists(optionElement)) return;
        closeParentModal(optionElement);
      }}
      overrideProps={props}
      asWideAsParent
      minWidth={`fit-content`}
    >
      {props.children}
      <Show when={exists(props.text)}>
        <Txt singleLine={props.singleLine}>{props.text}</Txt>
      </Show>
      <Show when={exists(props.icon)}>
        <Icon iconPath={props.icon!} />
      </Show>
    </Row>
  );
}
