import {
  Box,
  BoxProps,
  Field,
  Icon,
  Row,
  Prop,
  Txt,
  useFormula,
  exists,
  makePropParser,
  popPage,
  useProp,
  Stack,
  pushPage,
  getMyPageIndex,
  theme,
  Align,
  Button,
} from "miwi";
import { mdiArrowLeft, mdiCogOutline } from "@mdi/js";
import { JSXElement, Show, onMount } from "solid-js";
import { pagePadding } from "./SimplePage";
import { SettingsPage } from "@/settings/SettingsPage";

export const defaultAppBarScale = 1.25;

export function SettingsButton() {
  return (
    <Icon
      iconPath={mdiCogOutline}
      stroke={theme.palette.text}
      onClick={() => {
        (window as any).testVal = Date.now();
        pushPage(SettingsPage, {});
      }}
    />
  );
}

export function InlineEditableAppBar(props: {
  name: Prop<string>;
  emptyWarning: string;
  fill?: string;
  right?: JSXElement;
}) {
  const isEditing = useProp(false);
  let nameFieldWasBlurredThisFrame = 0;
  const isEmpty = useFormula(() => props.name.value.trim() === ``);
  return (
    <InlineAppBar
      fill={props.fill}
      name={
        <Row
          scale={defaultAppBarScale}
          padBetween={0.25}
          widthGrows
          overflowXCrops
          overflowYScrolls
          height={defaultAppBarScale * 1.25}
          alignCenter
        >
          <Show
            when={!isEmpty.value || isEditing.value}
            fallback={
              <Txt
                singleLine
                alignCenter
                stroke={theme.palette.warning}
                onClick={() => (isEditing.value = true)}
              >
                {props.emptyWarning}
              </Txt>
            }
          >
            <Field
              scale={defaultAppBarScale}
              alignCenter
              hasFocus={isEditing}
              onBlur={() => {
                nameFieldWasBlurredThisFrame++;
                requestAnimationFrame(() => {
                  nameFieldWasBlurredThisFrame--;
                });
              }}
              value={props.name}
              onlyWriteOnBlur
            />
          </Show>
          {/* <Box padAroundY={defaultAppBarScale * 0.1}>
              <Field
                scale={defaultAppBarScale}
                alignCenter
                hasFocus={isEditing}
                onBlur={() => {
                  nameFieldWasBlurredThisFrame++;
                  requestAnimationFrame(() => {
                    nameFieldWasBlurredThisFrame--;
                  });
                }}
                value={props.title}
              />
            </Box> */}
        </Row>
      }
      right={
        props.right
        // <Icon
        //   iconPath={isEditing.value ? mdiCheck : mdiPencilOutline}
        //   stroke={isEditing.value ? theme.palette.primary : undefined}
        //   onClick={() => {
        //     if (!isEditing.value && nameFieldWasBlurredThisFrame === 0) {
        //       isEditing.value = true;
        //     }
        //   }}
        // />
      }
    />
  );
}

export function InlineAppBar(
  props: {
    name?: string | JSXElement;
    right?: JSXElement;
    emptyWarning?: string;
  } & BoxProps,
) {
  const iconSize = 1.25;
  const parseProp: (...args: any[]) => any = makePropParser(props);
  const fill = parseProp(`fill`) ?? theme.palette.pageBackground;
  const showBackButton = useProp(false); // useFormula(() => nav.openedPages.value.length > 1);
  const isEmpty = useFormula(
    () => typeof props.name === `string` && props.name.trim() === ``,
  );
  let element: HTMLElement | null = null;
  onMount(() => {
    if (!exists(element)) return;
    showBackButton.value = (getMyPageIndex(element) ?? 0) > 0;
  });
  return (
    <Box
      padTop={`env(safe-area-inset-top)`}
      fill={fill}
      zIndex={5}
      getElement={(el) => (element = el)}
    >
      <Row
        widthGrows
        alignCenter
        padAround={pagePadding}
        padBetween={0.5}
        padBottom={1}
        overrideProps={props}
      >
        {/* <Show when={showBackButton.value}> */}
        <Stack
          width={iconSize}
          height={iconSize}
          alignCenter
          scale={iconSize}
          overflowXSpills
        >
          <Show when={showBackButton.value}>
            <Button
              pill
              width={iconSize + 0.5}
              height={iconSize + 0.5}
              fill={$theme.colors.pageBackground}
              outlineSize={0}
              outlineColor={$theme.colors.pageBackground}
              onClick={popPage}
            />
            <Icon iconPath={mdiArrowLeft} scale={iconSize} />
          </Show>
        </Stack>
        {/* </Show> */}
        {/* <Box width={iconSize} height={iconSize}>
          <UploadingIndicator />
        </Box> */}
        <Box widthGrows>
          {!exists(props.name) ? (
            <Txt h2 stroke={`transparent`} height={defaultAppBarScale * 1.25}>
              X
            </Txt>
          ) : typeof props.name === "string" ? (
            <Txt
              h2
              singleLine
              height={defaultAppBarScale * 1.25}
              stroke={isEmpty.value ? theme.palette.warning : undefined}
            >
              {isEmpty.value ? (props.emptyWarning ?? `Unnamed!`) : props.name}
            </Txt>
          ) : (
            props.name
          )}
        </Box>

        {/* <Show when={showBackButton.value}>
          <Box width={iconSize} height={iconSize} />
        </Show> */}
        <Box width={iconSize} align={Align.centerRight} scale={iconSize}>
          {props.right}
        </Box>
      </Row>
    </Box>
  );
}
