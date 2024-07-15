import {
  Box,
  Column,
  Field,
  Txt,
  doWatch,
  theme,
  useFormula,
  useProp,
} from "miwi";
import { OnBoardingButton, OnBoardingPage } from "./OnBoardingUtils";
import { mfs } from "@/model/DataModel";
import { LoadingPage } from "./LoadingPage";
import { Show } from "solid-js";

export function StartOrJoinTeamPage() {
  const oneTimeInviteCode = useProp("");
  const errorText = useProp("");
  const showErrorText = useFormula(() => errorText.value.trim().length > 0);
  doWatch(() => {
    if (oneTimeInviteCode.value !== ``) {
      errorText.value = ``;
    }
  });

  return (
    <Show
      when={mfs.user.workspace?.isJoining || mfs.user.workspace?.isCreating}
      fallback={
        <OnBoardingPage>
          <Txt h2>Join Team</Txt>
          <Box height={0.5} />
          <Column padBetween={1} padAroundX={1.5}>
            {/* Joint team via Invite Code */}
            <Txt widthGrows hint>
              {mfs.user.email ?? `Unknown Email`}
            </Txt>
            <Field
              value={oneTimeInviteCode}
              tempValue={oneTimeInviteCode}
              hintText="Invite Code"
              underlined
            />

            {/* Error Text */}
            <Show when={showErrorText.value}>
              <Txt
                scale={1 * 0.95}
                alignLeft
                widthGrows
                stroke={theme.palette.error}
              >
                {errorText.value}
              </Txt>
            </Show>

            {/* Sign Up / In */}
            <Box padAroundY={1.125}>
              <OnBoardingButton
                widthGrows
                onClick={async () => {
                  if (oneTimeInviteCode.value.trim().length === 0) {
                    errorText.value = `Please enter an invite code.`;
                    return;
                  }
                  try {
                    await mfs.user.workspace?.joinWorkspace?.({
                      inviteCode: oneTimeInviteCode.value,
                    });
                  } catch (e) {
                    // See: https://firebase.google.com/docs/functions/callable?gen=2nd#web-modular-api_5
                    const error = {
                      code: (e as any)?.code as string | undefined,
                      message: (e as any)?.message as string | undefined,
                      details: (e as any)?.details as string | undefined,
                    };
                    console.warn(JSON.stringify(error, null, 2));
                    if (error.code === `functions/invalid-argument`) {
                      errorText.value = `Invalid invite code.`;
                    } else if (error.code === `functions/not-found`) {
                      errorText.value = `Invite not found check the code.`;
                    } else if (error.code === `functions/deadline-exceeded`) {
                      errorText.value = `The invite has expired. Please ask the team owner to send a new invite.`;
                    } else {
                      errorText.value = `An unknown error occurred. Contact info@tke.us and provide this code: ${error.code}`;
                    }
                  }
                }}
              >
                Join Team
              </OnBoardingButton>
            </Box>

            {/* Sign Out */}
            <Txt hint widthGrows alignLeft>
              <span>
                Not your email?{" "}
                <div
                  style={{
                    display: `inline-block`,
                    "vertical-align": `top`,
                  }}
                >
                  <Txt
                    stroke={theme.palette.primary}
                    underlineText
                    onClick={() => mfs.user.signOut?.()}
                  >
                    Sign out
                  </Txt>
                </div>
              </span>
            </Txt>
            <Txt hint widthGrows alignLeft>
              <span>
                Or{" "}
                <div
                  style={{
                    display: `inline-block`,
                    "vertical-align": `top`,
                  }}
                >
                  <Txt
                    stroke={theme.palette.primary}
                    underlineText
                    onClick={mfs.user.workspace?.createWorkspace}
                  >
                    Start a new team
                  </Txt>
                </div>
              </span>
            </Txt>
          </Column>
        </OnBoardingPage>
      }
    >
      <LoadingPage
        name={mfs.user.workspace?.isCreating ? `Creating Team` : `Joining Team`}
      />
    </Show>
  );
}
