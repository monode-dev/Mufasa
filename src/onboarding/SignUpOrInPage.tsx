import {
  Box,
  Column,
  Field,
  Txt,
  exists,
  pushPage,
  useProp,
  doWatch,
  ReadonlyProp,
  doNow,
  Icon,
  mdColors,
  theme,
} from "miwi";
import { OnBoardingButton, OnBoardingPage } from "./OnBoardingUtils";
import { Show } from "solid-js";
import { PrivacyPolicyPage } from "@/settings/PrivacyPolicyPage";
import googleLogo from "@/assets/google-logo.webp";
import appleLogo from "@/assets/apple-logo.webp";
import { firebaseAuth, signInWithApple } from "@/model/CloudPersister";
import { mfs } from "@/model/DataModel";
import { LoadingPage } from "./LoadingPage";
import { mdiEmailOutline } from "@mdi/js";
import { Capacitor } from "@capacitor/core";
import { sendPasswordResetEmail } from "firebase/auth";

// TODO: On sign in with email, we pop the page, way for the delay and the show the loading screen. This should probably happen immediately.
export function SignUpOrInPage(props: {
  showSignUp?: boolean | null;
  havePickedUseEmail?: boolean;
  onSignUpToggle?: (newValue: boolean) => void;
}) {
  const isIosPlatform = Capacitor.getPlatform() === "ios";
  const havePickedUseEmail = props.havePickedUseEmail ?? false;
  const showSignUp = useProp<boolean | null>(props.showSignUp ?? null);
  doWatch(() => {
    if (exists(props.onSignUpToggle) && exists(showSignUp.value)) {
      props.onSignUpToggle!(showSignUp.value);
    }
  });

  const email = useProp("");
  const password = useProp("");
  const confirmPassword = useProp("");
  const errorText = useProp<string | null>(null);
  const passwordResetStatus = useProp<null | {
    type: `sending` | `error` | `sent`;
    text: string;
  }>(null);

  const showSignInLoading = doNow<ReadonlyProp<boolean>>(() => {
    const shouldShowAuthLoading = useProp(false);
    doWatch(() => {
      if (mfs.user.isSigningIn === true) {
        setTimeout(() => {
          if (mfs.user.isSigningIn === true) {
            shouldShowAuthLoading.value = true;
          }
        }, 1000 / 2);
      } else {
        shouldShowAuthLoading.value = false;
      }
    });
    return shouldShowAuthLoading;
  });

  async function signInOrUpWithEmailAndPassword() {
    errorText.value = validateInputs();
    if (exists(errorText.value)) return;
    try {
      if (showSignUp.value) {
        await mfs.user.signUpWithEmail?.(email.value, password.value);
      } else {
        await mfs.user.signInWithEmail?.(email.value, password.value);
      }
    } catch (error) {
      if ((error as { code: string }).code === "auth/invalid-credential") {
        errorText.value = "Email or password is incorrect";
      } else if (
        (error as { code: string }).code === "auth/email-already-in-use"
      ) {
        errorText.value = "Email already in use";
      } else {
        errorText.value = "Something went wrong.";
      }
    }
  }

  function validateInputs(): string | null {
    if (email.value === "") {
      return "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      return "Email format is incorrect.";
    } else if (password.value === "") {
      return "Password is required.";
    } else if (password.value.length < 6) {
      return "Password is too short";
    } else if (confirmPassword.value === "" && showSignUp.value) {
      return "Confirm password is required.";
    } else if (password.value !== confirmPassword.value && showSignUp.value) {
      return "Passwords don't match.";
    } else if (!navigator.onLine) {
      return "No internet connection.";
    }
    return null;
  }

  doWatch(() => {
    if (email.value !== "") {
      passwordResetStatus.value = null;
    }
  });

  async function resetPassword() {
    if (email.value.trim().length === 0) {
      passwordResetStatus.value = {
        type: `error`,
        text: "Enter your email address.",
      };
      return;
    }

    try {
      passwordResetStatus.value = {
        type: `sending`,
        text: "Sending reset password email...",
      };
      await sendPasswordResetEmail(firebaseAuth, email.value);
      passwordResetStatus.value = {
        type: `sent`,
        text: "Reset password email sent.",
      };
      setTimeout(() => {
        passwordResetStatus.value = null;
      }, 4 * 1000);
    } catch (error) {
      passwordResetStatus.value = {
        type: `error`,
        text: "Could not send reset password email.",
      };
      console.error(error);
    }
  }

  // Preload provider logos
  [googleLogo, appleLogo].forEach((src) => (new Image().src = src));

  return (
    /* We handle the sign-in loading page here so that this sign-in page can
     * keep its state. */
    <Show
      when={!showSignInLoading.value}
      fallback={<LoadingPage name="Signing in" />}
    >
      <Show
        when={exists(showSignUp.value)}
        fallback={
          <OnBoardingPage>
            <Txt padBottom={1} h2>
              Are you new here?
            </Txt>
            <Box height={0.5} />
            <OnBoardingButton
              onClick={() =>
                pushPage(SignUpOrInPage, {
                  showSignUp: true,
                })
              }
            >
              Sign up
            </OnBoardingButton>
            <Box height={1} />
            <OnBoardingButton
              onClick={() =>
                pushPage(SignUpOrInPage, {
                  showSignUp: false,
                })
              }
            >
              Sign in
            </OnBoardingButton>
          </OnBoardingPage>
        }
      >
        <OnBoardingPage>
          <Txt padBottom={1} h2>
            {showSignUp.value ? "Sign Up" : "Sign In"}
          </Txt>
          <Box height={1} />
          <Column padBetween={1} padAroundX={1.5}>
            <Show
              when={havePickedUseEmail}
              fallback={
                <>
                  {/* Use Email */}
                  <OnBoardingButton
                    widthGrows
                    onClick={() =>
                      pushPage(SignUpOrInPage, {
                        showSignUp: showSignUp.value,
                        havePickedUseEmail: true,
                        onSignUpToggle: (newValue: any) =>
                          (showSignUp.value = newValue),
                      })
                    }
                  >
                    <Icon iconPath={mdiEmailOutline} scale={1.1} />
                    Use Email&nbsp;&nbsp;&nbsp;
                  </OnBoardingButton>

                  {/* Use Google */}
                  <OnBoardingButton
                    widthGrows
                    onClick={() => mfs.user.signInWithGoogle?.()}
                  >
                    <Box
                      fill={googleLogo}
                      width={1.1}
                      height={1.1}
                      overflowXSpills
                      overflowYSpills
                      backgroundContain
                    />
                    Use Google
                  </OnBoardingButton>

                  {/* Use Apple */}
                  <Show when={isIosPlatform}>
                    <OnBoardingButton
                      widthGrows
                      onClick={() => signInWithApple()}
                    >
                      <Box
                        fill={appleLogo}
                        width={1.1}
                        height={1.1}
                        overflowXSpills
                        overflowYSpills
                        backgroundContain
                      />
                      Use Apple&nbsp;&nbsp;&nbsp;
                    </OnBoardingButton>

                    {/* <Txt hint>{appleSignInLogs.value}</Txt> */}
                  </Show>
                </>
              }
            >
              {/* Email */}
              <Field
                value={email}
                // tempValue={email}
                hintText="Email"
                underlined
              />
              {/* Password */}
              <Field
                // TODO: Hide the text in this field
                inputType="password"
                value={password}
                // tempValue={password}
                hintText="Password"
                underlined
              />
              {/* Confirm Password */}
              <Show when={showSignUp.value}>
                <Field
                  // TODO: Hide the text in this field
                  inputType="password"
                  value={confirmPassword}
                  // tempValue={confirmPassword}
                  hintText="Confirm Password"
                  underlined
                />
              </Show>

              {/* Error Text */}
              <Show when={exists(errorText.value)}>
                <Txt
                  scale={1 * 0.95}
                  alignLeft
                  widthGrows
                  stroke={mdColors.red}
                >
                  {errorText.value}
                </Txt>
              </Show>

              {/* Sign Up / In */}
              <Box padAroundY={1.125}>
                <OnBoardingButton
                  widthGrows
                  onClick={signInOrUpWithEmailAndPassword}
                >
                  {showSignUp.value ? "Sign up" : "Sign in"}
                </OnBoardingButton>
              </Box>
            </Show>

            {/* Privacy Policy */}
            <Show when={showSignUp.value}>
              <Txt hint widthGrows alignLeft>
                <span>
                  See our{" "}
                  <div
                    style={{
                      display: `inline-block`,
                      "vertical-align": `middle`,
                    }}
                  >
                    <Txt
                      underlineText
                      onClick={() => {
                        pushPage(PrivacyPolicyPage, {});
                      }}
                      stroke={theme.palette.primary}
                    >
                      Privacy Policy
                    </Txt>
                  </div>
                </span>
              </Txt>
            </Show>

            {/* Swap Sign Up/In */}
            <Txt hint widthGrows alignLeft>
              <span>
                {showSignUp.value
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <div
                  style={{
                    display: `inline-block`,
                    "vertical-align": `middle`,
                  }}
                >
                  <Txt
                    stroke={theme.palette.primary}
                    underlineText
                    onClick={() => (showSignUp.value = !showSignUp.value)}
                  >
                    {showSignUp.value ? "Sign in" : "Sign up"}
                  </Txt>
                </div>
              </span>
            </Txt>

            {/* Forgot Password */}
            <Show when={!showSignUp.value && havePickedUseEmail}>
              <Txt
                widthGrows
                alignLeft
                hint
                // underlineText
                // scale={1 * 0.85}
                // textColor={theme.palette.primary}
                stroke={
                  passwordResetStatus.value?.type === `sent`
                    ? mdColors.green
                    : passwordResetStatus.value?.type === `error`
                      ? theme.palette.error
                      : passwordResetStatus.value?.type === `sending`
                        ? theme.palette.hint
                        : undefined
                }
              >
                <Show
                  when={passwordResetStatus.value === null}
                  fallback={passwordResetStatus.value?.text}
                >
                  <span>
                    Forgot your password?{" "}
                    <div
                      style={{
                        display: `inline-block`,
                        "vertical-align": `middle`,
                      }}
                    >
                      <Txt
                        stroke={theme.palette.primary}
                        underlineText
                        onClick={resetPassword}
                      >
                        Reset it
                      </Txt>
                    </div>
                  </span>
                </Show>
              </Txt>
            </Show>
          </Column>
        </OnBoardingPage>
      </Show>
    </Show>
  );
}
