import { Box, Column, Txt, theme, useProp } from "miwi";
import { OnBoardingPage } from "./OnBoardingUtils";
import { firebaseAuth } from "@/model/CloudPersister";
import { mfs } from "@/model/DataModel";
import { sendEmailVerification } from "firebase/auth";
import { Show } from "solid-js";

export function VerifyAccountPage() {
  const isSendingEmail = useProp(false);
  return (
    <OnBoardingPage>
      <Txt h2>Verify Account</Txt>
      <Box height={0.5} />
      <Column padBetween={1} padAroundX={1.5}>
        <Txt widthGrows alignLeft>
          A verification email has been sent to{" "}
          {mfs.user.email ?? `Unknown Email`}
        </Txt>
        <Txt widthGrows alignLeft>
          Please click the link in that email and then come back here.
        </Txt>
        <Box />
        <Txt hint widthGrows alignLeft>
          {/* TODO: Show a sent on done. */}
          <Show
            when={isSendingEmail.value}
            fallback={
              <span>
                Don't see the email?{" "}
                <div
                  style={{
                    display: `inline-block`,
                    "vertical-align": `top`,
                  }}
                >
                  <Txt
                    stroke={theme.palette.primary}
                    underlineText
                    onClick={async () => {
                      if (!firebaseAuth.currentUser) return;
                      isSendingEmail.value = true;
                      await sendEmailVerification(firebaseAuth.currentUser);
                      isSendingEmail.value = false;
                    }}
                  >
                    Resend
                  </Txt>
                </div>
              </span>
            }
          >
            Sending verification email...
          </Show>
        </Txt>
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
      </Column>
    </OnBoardingPage>
  );
}
