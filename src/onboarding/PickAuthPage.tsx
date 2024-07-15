import { Txt, Box, pushPage } from "miwi";
import { OnBoardingButton, OnBoardingPage } from "./OnBoardingUtils";
import { SignUpOrInPage } from "./SignUpOrInPage";

export function PickAuthPage() {
  return (
    <OnBoardingPage>
      <Txt h2>Are you new here?</Txt>
      <Box height={0.5} />
      <OnBoardingButton
        onClick={() => pushPage(SignUpOrInPage, { showSignUp: true })}
      >
        Sign up
      </OnBoardingButton>
      <Box height={1} />
      <OnBoardingButton
        onClick={() => pushPage(SignUpOrInPage, { showSignUp: false })}
      >
        Sign in
      </OnBoardingButton>
    </OnBoardingPage>
  );
}
