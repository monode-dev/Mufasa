import { mdiMenuDown, mdiMenuRight } from "@mdi/js";
import { Box, Column, Icon, mdColors, Row, Txt, useProp } from "miwi";
import { JSX, Show } from "solid-js";

export function InfoEntry(props: {
  entryTitle: string;
  entryContent?: string;
  children?: JSX.Element;
}) {
  const showEntry = useProp(false);
  function toggleShowEntry() {
    showEntry.value = !showEntry.value;
  }

  return (
    <Column padBetween={0} asWideAsParent>
      <Row>
        <Icon
          stroke={mdColors.black}
          iconPath={showEntry.value ? mdiMenuDown : mdiMenuRight}
        />

        {/* Title */}
        <Txt onClick={toggleShowEntry} widthGrows alignLeft bold>
          {props.entryTitle}
        </Txt>
      </Row>
      {/* Content */}
      <Show when={showEntry.value}>
        <Txt overflowXSpills padLeft={1} widthGrows alignLeft>
          {props.entryContent}
        </Txt>
        <Box  padLeft={1} alignLeft asWideAsParent>{props.children}</Box>
      </Show>
    </Column>
  );
}
