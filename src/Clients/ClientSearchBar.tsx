import { Row, Box, Field, Icon, mdColors, Prop, useProp } from "miwi";
import { mdiClose } from "@mdi/js";

export default function ClientSearchBar(props: {
  filterString: Prop<string>;
  isSearching: Prop<boolean>;
}) {
  
  function close() {
    props.filterString.value = ``;
    props.isSearching.value = false;
  }

  return (
    <Row
      widthGrows={true}
      fill={$theme.colors.primary}
      padBetween={0.75}
      zIndex={1}
    >
      <Row
        widthGrows={true}
        pad={0.25}
        cornerRadius={0.75} //0.75
        align={$Align.centerLeft}
        fill={mdColors.white}
        stroke={mdColors.grey}
      >
        <Box width={0.25} />
        <Field
          hintText={"Search by Name or ID"}
          scale={1}
          fill={mdColors.white}
          widthGrows={true}
          hasFocus={useProp(true)} // Check if this is correct !!!
          value={props.filterString}
        />
        <Box width={0.25} />
      </Row>
      <Icon
        iconPath={mdiClose}
        stroke={mdColors.white}
        onClick={close}
        scale={1.35}
      />
    </Row>
  );
}
