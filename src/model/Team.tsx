import { exists, Dialog, Txt, popPage, pushPage } from "miwi";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { mfs, premiumEnabled } from "./DataModel";
import { createLimitTrackers } from "./LimitUtils";

export const memberLimit = createLimitTrackers({
  free: 1,
  premium: 25,
  getPremiumEnabled: () => premiumEnabled.value,
  getCount: () => 1 + (mfs.user.workspace?.otherMembers?.length ?? 0),
  mayAdd: () => premiumEnabled.value,
});

export async function inviteTeamMember() {
  pushPage(
    () => (
      <Dialog doNotCloseOnClickOutside>
        <Txt>Creating Invite...</Txt>
      </Dialog>
    ),
    {},
  );
  const result = await Promise.race([
    new Promise<undefined>((resolve) => setTimeout(resolve, 10 * 1000)),
    mfs.user.workspace?.createWorkspaceInvite?.(),
  ]);
  if (!exists(result)) {
    popPage();
  } else {
    const subject = `Join my Ninety Percent team.`;
    const body = `Join my Ninety Percent team.\n\n1. Install the app.\niphone: https://apps.apple.com/us/app/id6449375829\nandroid: https://play.google.com/store/apps/details?id=us.tke.ninetypercent\n\n2. Sign in to the app.\n\n3. Use the invite code: ${result.inviteCode}\n\nThis invite will expire in ${result.validForDays} days.`;
    if (Capacitor.isNativePlatform()) {
      setTimeout(() => popPage(), 500);
      await Share.share({
        title: subject,
        text: body,
      });
    } else {
      setTimeout(() => popPage(), 500);
      (window as any).location =
        `mailto:?Subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  }
}
