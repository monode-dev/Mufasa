import { Column, CircularProgressIndicator, Txt, theme } from "miwi";
import { OnBoardingPage } from "./OnBoardingUtils";

export function LoadingPage(props: {
  name?: string;
  hideEllipsis?: boolean;
  stroke?: string;
}) {
  return (
    <OnBoardingPage hideAppBar signatureStroke={props.stroke}>
      <Column pad={1}>
        <CircularProgressIndicator
          diameter={2.75}
          thickness={1 / 4}
          color={props.stroke ?? theme.palette.hint}
        />
        <Txt stroke={props.stroke ?? theme.palette.hint}>
          {props.name ?? `Loading`}
          {props.hideEllipsis ? `` : `...`}
        </Txt>
      </Column>
    </OnBoardingPage>
  );
}
