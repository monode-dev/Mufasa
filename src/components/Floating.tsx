import { Button, Icon, Box, exists, theme } from "miwi";
import { JSX } from "solid-js/jsx-runtime";

export function FloatingButtonSpacer() {
  return <Box height={2.25} />;
}

export const floatingActionButtonHeight = 3.5;
export function FloatingActionButton(props: {
  stroke?: string;
  icon: string;
  onClick: () => void;
  scale?: number;
  children?: JSX.Element;
}) {
  return (
    <Button
      width={floatingActionButtonHeight}
      height={floatingActionButtonHeight}
      pad={0}
      raised
      round
      fill={theme.palette.accent}
      stroke={props.stroke ?? theme.palette.primary}
      shadowSize={1.5}
      onClick={props.onClick}
    >
      {exists(props.children) ? (
        props.children
      ) : (
        <Icon scale={props.scale ?? 2.5} iconPath={props.icon} />
      )}
    </Button>
  );
}
