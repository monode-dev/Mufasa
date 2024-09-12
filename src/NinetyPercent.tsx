/* @refresh reload */
import "miwi";
import {
  Nav,
  popPage,
  setTheme,
  pushPage,
  Box,
  ReadonlyProp,
  doNow,
  doWatch,
  useNav,
  useProp,
  mdColors,
} from "miwi";
import { Match, Switch, render, untrack } from "solid-js/web";
import "./assets/main.css";
import "solid-devtools";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { onMount } from "solid-js";
import { mfs } from "./model/DataModel";
import { DeliveriesPage } from "./Deliveries/DeliveriesPage";
import { LoadingPage } from "./onboarding/LoadingPage";
import { SignUpOrInPage } from "./onboarding/SignUpOrInPage";
import { StartOrJoinTeamPage } from "./onboarding/StartOrJoinTeamPage";
import { VerifyAccountPage } from "./onboarding/VerifyAccountPage";
import { Network } from "@capacitor/network";
import googleAuthConfig from "./assets/google-auth-config.json";
import { Capacitor } from "@capacitor/core";

(window as any).startTime = Date.now();

// Set the primary color for Miwi
setTheme({
  colors: {
    primary: "#4caf50",
    hint: mdColors.grey,
  },
  // debugInteractableArea: true,
});

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => {
  CapacitorApp.addListener("backButton", popPage);
  pushPage(PageSwitch, {});
  onMount(() => {
    SplashScreen.hide();
  });
  const isOnline = useProp(true);
  Network.getStatus().then((status) => (isOnline.value = status.connected));
  Network.addListener("networkStatusChange", (status) => {
    isOnline.value = status.connected;
  });
  return <Nav isOnlineSig={isOnline} />;
}, root!);

export function PageSwitch() {
  // Hide the UI until we know the onboarding state.
  const startTime = Date.now();
  let previousAuthUser = mfs.user;
  let previousWorkspaceId = mfs.user.workspace?.id;
  const nav = useNav();
  onMount(() => {
    const isIos = Capacitor.getPlatform() === "ios";
    GoogleAuth.initialize({
      clientId:
        Capacitor.getPlatform() === "ios"
          ? googleAuthConfig.iosClientId
          : googleAuthConfig.clientId,
      scopes: ["profile", "email"],
      grantOfflineAccess: true,
    });
  });
  doWatch(() => {
    // if (exists(signInStatus.value) && exists(haveJoinedOrg.value)) {
    if (!mfs.user.isPending) {
      // Hide the splash screen next frame to give the onboarding pages time to render.
      requestAnimationFrame(() => {
        // TODO: In future maybe watch mufasa to determine this.
        // Don't load faster than 500ms to give the DB time to set itself up.
        const delay = Math.max(0, 500 - (Date.now() - startTime));
        setTimeout(SplashScreen.hide, delay);
      });
    }

    // TODO: Have a way to swap out pages at specific indexes.
    if (
      !mfs.user.isSigningIn &&
      (previousAuthUser !== mfs.user ||
        previousWorkspaceId !== mfs.user.workspace?.id)
    ) {
      previousAuthUser = mfs.user;
      previousWorkspaceId = mfs.user.workspace?.id;
      while (untrack(() => nav.openedPages.value.length > 1)) {
        nav.popPage();
      }
    }
  });
  const showSignOutLoading = doNow<ReadonlyProp<boolean>>(() => {
    const showSigningOutLoading = useProp(false);
    doWatch(() => {
      if (mfs.user.isSigningOut === true) {
        setTimeout(() => {
          if (mfs.user.isSigningOut === true) {
            showSigningOutLoading.value = true;
          }
        }, 1000 / 8);
      } else {
        showSigningOutLoading.value = false;
      }
    });
    return showSigningOutLoading;
  });

  const setPageName = doNow(() => {
    let pageName = `userPending`;
    return (name: string) => {
      if (name === pageName) return;
      pageName = name;
      while (untrack(() => nav.openedPages.value.length > 1)) {
        nav.popPage();
      }
    };
  });
  doWatch(() => {
    switch (true) {
      case mfs.user.isPending:
        setPageName(`userPending`);
        break;
      case mfs.user.isSignedInButNotVerified:
        setPageName(`verifyAccount`);
        break;
      case mfs.user.isSignedOut || mfs.user.isSigningIn:
        setPageName(`signUpOrIn`);
        break;
      case showSignOutLoading.value:
        setPageName(`signOutLoading`);
        break;
      case mfs.user.workspace?.isPending:
        setPageName(`workspacePending`);
        break;
      case mfs.user.workspace?.isLeaving:
        setPageName(`workspaceLeaving`);
        break;
      case !mfs.user.workspace?.haveJoined:
        setPageName(`startOrJoinTeam`);
        break;
      default:
        setPageName(`homePage`);
        break;
    }
  });

  return (
    <Box asWideAsParent asTallAsParent>
      <Switch fallback={<DeliveriesPage />}>
        <Match when={mfs.user.isPending}>
          <LoadingPage name="Loading" />
        </Match>
        <Match when={mfs.user.isSignedInButNotVerified}>
          <VerifyAccountPage />
        </Match>
        {/* We could show a loading screen for auth pending, but we're using the
         * splash screen instead and I don't want a loading screen to flash for
         * a frame or two between hiding the splash screen and showing the
         * sign-in page. */}
        <Match when={mfs.user.isSignedOut || mfs.user.isSigningIn}>
          <SignUpOrInPage />
        </Match>
        {/* We don't handle sign-in loading here because we want the sign-in page
         * to be able to preserve it's state. */}
        <Match when={showSignOutLoading.value}>
          <LoadingPage name="Signing out" />
        </Match>
        <Match when={mfs.user.workspace?.isPending}>
          <LoadingPage name="Loading" />
        </Match>
        <Match when={mfs.user.workspace?.isLeaving}>
          <LoadingPage name="Leaving Team" />
        </Match>
        <Match when={!mfs.user.workspace?.haveJoined}>
          <StartOrJoinTeamPage />
        </Match>
      </Switch>
    </Box>
  );
}
