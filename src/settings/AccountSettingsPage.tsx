import { Box, Txt, exists, pushPage, useFormula, theme } from "miwi";
import { SimplePage } from "@/components/SimplePage";
import { SimpleBody } from "@/components/SimpleBody";
import { Show } from "solid-js";
import { mfs } from "@/model/DataModel";
import { ConfirmationPopUp } from "@/components/ConfirmationPopUp";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { deleteAccount } from "./DeleteAccountOrTeam";
import { InlineAppBar } from "@/components/InlineAppBar";
import { HorizontalDivider } from "@/components/HorizontalDivider";

export const openTermsOfUse = () =>
  window.open(
    `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
    `_blank`,
  );

export function AccountSettingsPage() {
  const isOwner = useFormula(() => mfs.user.workspace?.role === `owner`);

  const emailIsValid = (email: string | null | undefined) =>
    exists(email) && email.trim().length > 0;

  return (
    <SimplePage>
      <InlineAppBar name={`Account`} />

      <SimpleBody>
        <Txt
          singleLine
          widthGrows
          alignCenterLeft
          bold
          stroke={emailIsValid(mfs.user.email) ? undefined : theme.palette.hint}
        >
          {emailIsValid(mfs.user.email) ? mfs.user.email : `Unknown Email!`}
        </Txt>
        <HorizontalDivider />

        <Txt
          widthGrows
          singleLine
          alignCenterLeft
          onClick={() => mfs.user.signOut?.()}
        >
          Sign Out
        </Txt>
        <Txt widthGrows singleLine alignCenterLeft onClick={openTermsOfUse}>
          Terms of Use
        </Txt>
        <Txt
          widthGrows
          singleLine
          alignCenterLeft
          onClick={() => pushPage(PrivacyPolicyPage, {})}
        >
          Privacy Policy
        </Txt>
        <Txt
          widthGrows
          singleLine
          alignCenterLeft
          stroke={theme.palette.error}
          onClick={deleteAccount}
        >
          Delete Account
        </Txt>
      </SimpleBody>
    </SimplePage>
  );
}
