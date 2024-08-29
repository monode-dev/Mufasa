import {
  canCallPhoneNumber,
  callPhoneNumber,
  canMapToAddress,
  mapToAddress,
} from "@/AppData";
import { mdiMapMarker, mdiPhoneInTalk } from "@mdi/js";
import { Row, Icon, theme } from "miwi";

export function CallAndMapToIcons(props: {
  forceHintColor?: boolean;
  phoneNumber: string | undefined | null;
  address: string | undefined | null;
}) {
  return (
    <Row>
      <Icon
        stroke={
          canCallPhoneNumber(props.phoneNumber) && !props.forceHintColor
            ? theme.palette.primary
            : theme.palette.hint
        }
        onClick={() => {
          if (canCallPhoneNumber(props.phoneNumber))
            callPhoneNumber(props.phoneNumber);
        }}
        iconPath={mdiPhoneInTalk}
      />
      <Icon
        stroke={
          canMapToAddress(props.address) && !props.forceHintColor
            ? theme.palette.primary
            : theme.palette.hint
        }
        onClick={() => {
          if (canMapToAddress(props.address)) mapToAddress(props.address);
        }}
        iconPath={mdiMapMarker}
      />
    </Row>
  );
}
