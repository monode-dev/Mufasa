import { mdiChatQuestionOutline } from "@mdi/js";
import { Button, Icon, theme } from "miwi";

export function openEmailDraftToDevs() {
  (window as any).location = `mailto:${encodeURIComponent(
    `info@tke.us`,
  )}?Subject=${encodeURIComponent(`About Ninety Percent`)}`;
}

export function ContactDevsButton() {
  return (
    <Button
      width={3.75}
      height={3.75}
      pad={0}
      raised
      round
      fill={theme.palette.accent}
      stroke={theme.palette.primary}
      shadowSize={1.5}
      onClick={() => openEmailDraftToDevs()}
    >
      <Icon scale={2.25} iconPath={mdiChatQuestionOutline} />
    </Button>
  );
}
