import { pushPage, Box, Txt } from "miwi";
import { OnBoardingButton, OnBoardingPage } from "./OnBoardingUtils";
import { PickAuthPage } from "./PickAuthPage";

export function AuthOrNotPage() {
  return (
    <OnBoardingPage>
      <Txt h2>Are you here to...</Txt>
      <Box height={0.5} />
      <OnBoardingButton onClick={() => pushPage(PickAuthPage, {})}>
        Join an existing team
      </OnBoardingButton>
      <Box height={1} />
      <OnBoardingButton
        onClick={() => {
          // haveJoinedOrg.value = true;
        }}
      >
        Try out the app
      </OnBoardingButton>
    </OnBoardingPage>
  );
}
