import { Box, Stack, exists, useFormula, useProp } from "miwi";
import { For, JSXElement } from "solid-js";

const pageClassTag = `miwi-nav-page`;
const activePageClass = `miwi-nav-active-page`;
export const createPageStack = (props: { root: JSXElement }) => {
  const pages = useProp([props.root]);
  const canPop = useFormula(() => pages.value.length > 1);
  return {
    Component: () => (
      <Stack asWideAsParent asTallAsParent>
        <For each={pages.value}>
          {(Page, getIndex) => (
            <Box
              widthGrows
              heightGrows
              classList={{
                [pageClassTag]: true,
                [activePageClass]: getIndex() === pages.value.length - 1,
              }}
            >
              {Page}
            </Box>
          )}
        </For>
      </Stack>
    ),
    pushPage: (page: JSXElement) => {
      pages.value = [...pages.value, page];
    },
    canPop,
    popPage: () => {
      if (!canPop.value) return;
      pages.value = pages.value.slice(0, -1);
    },
  } as const;
};

export function findPageInAncestors(
  currentElement: HTMLElement,
): HTMLElement | null {
  // Find Touch Element for current page
  let element: HTMLElement | null = currentElement;
  while (exists(element) && !element.classList.contains(pageClassTag)) {
    element = element.parentElement;
  }
  return element;
}
export function isActivePage(page: HTMLElement): boolean {
  return page.classList.contains(activePageClass);
}
