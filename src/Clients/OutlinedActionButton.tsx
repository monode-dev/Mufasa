import { Button, Icon, Txt, mdColors } from "miwi";

export default function OutlinedActionButton(props: {
  action: string;
  iconPath: string;
  onClick: (e: MouseEvent) => void | undefined | null;
}) {
  return (
    <Button
      outlined
      pill
      onClick={props.onClick}
      fill={$theme.colors.primary}
      stroke={mdColors.white}
      padAroundY={0.25}
      padAroundX={0.5}
      padBetween={0.125}
    >
      <Txt>{props.action}</Txt>
      <Icon iconPath={props.iconPath} stroke={mdColors.white} />
    </Button>
  );
}
