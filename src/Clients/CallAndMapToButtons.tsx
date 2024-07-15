import {
  canCallPhoneNumber,
  callPhoneNumber,
  canMapToAddress,
  mapToAddress,
} from "@/AppData";
import { mdiMapMarker, mdiPhoneInTalk } from "@mdi/js";
import { Row, Button, Icon, Txt } from "miwi";

export function CallAndMapButtons(props: {
  phoneNumber: string | undefined | null;
  address: string | undefined | null;
}) {
  return (
    <Row widthGrows spaceEvenly>
      <Button
        width={5}
        outlined
        pill
        stroke={
          canCallPhoneNumber(props.phoneNumber) ? undefined : $theme.colors.hint
        }
        onClick={() => {
          if (canCallPhoneNumber(props.phoneNumber))
            callPhoneNumber(props.phoneNumber);
        }}
        padBetween={0.25}
      >
        <Icon iconPath={mdiPhoneInTalk} />
        <Txt>Call</Txt>
      </Button>
      <Button
        width={5}
        outlined
        pill
        stroke={canMapToAddress(props.address) ? undefined : $theme.colors.hint}
        onClick={() => {
          if (canMapToAddress(props.address)) mapToAddress(props.address);
        }}
        padBetween={0.25}
      >
        <Icon iconPath={mdiMapMarker} />
        <Txt>Map</Txt>
      </Button>
    </Row>
  );
}
