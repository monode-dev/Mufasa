import {
  canCallPhoneNumber,
  callPhoneNumber,
  canMapToAddress,
  mapToAddress,
} from "@/AppData";
import { mdiMapMarker, mdiPhoneInTalk } from "@mdi/js";
import {Row, Icon, theme} from "miwi";

export function CallAndMapToIcons(props: {
  phoneNumber: string | undefined | null;
  address: string | undefined | null;
}) {
  return (
    <Row>
      <Icon
        stroke={
          canCallPhoneNumber(props.phoneNumber) ? $theme.colors.primary : $theme.colors.hint
        }
        onClick={() => {
          if (canCallPhoneNumber(props.phoneNumber))
            callPhoneNumber(props.phoneNumber);
        }}
       iconPath={mdiPhoneInTalk}
      />
      <Icon
        stroke={canMapToAddress(props.address) ? $theme.colors.primary : $theme.colors.hint}
        onClick={() => {
          if (canMapToAddress(props.address)) mapToAddress(props.address);
        }}
        iconPath={mdiMapMarker}
      />
    </Row>
  );
}
