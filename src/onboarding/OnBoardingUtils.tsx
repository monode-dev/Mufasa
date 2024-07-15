import { Box, Txt, Button, BoxProps, theme } from "miwi";
import { InlineAppBar, defaultAppBarScale } from "@/components/InlineAppBar";
import { SimplePage, pagePadding } from "@/components/SimplePage";
import { JSX, Show } from "solid-js";
import { SimpleBody } from "@/components/SimpleBody";

// SECTION: OnBoarding Page
export const onBoardingContentWidth = 12;
export function OnBoardingPage(props: {
  hideAppBar?: boolean;
  children?: JSX.Element;
  hideSignature?: boolean;
  signatureStroke?: string;
}) {
  return (
    <SimplePage>
      <Show
        when={!props.hideAppBar}
        fallback={
          <Box padTop={`env(safe-area-inset-top)`}>
            <Box height={pagePadding + 1.25 + 1} />
          </Box>
        }
      >
        <InlineAppBar />
      </Show>
      <SimpleBody padBetween={0}>
        <Box heightGrows={4} />
        {props.children}
        {/* <Box heightGrows={4} /> */}
        <Box heightGrows={5} />
        <Txt
          height={defaultAppBarScale}
          stroke={props.signatureStroke ?? theme.palette.hint}
          alignBottomCenter
        >
          {props.hideSignature ? `` : `Ninety Percent by tke.us`}
        </Txt>
      </SimpleBody>
    </SimplePage>
  );
}

// SECTION: OnBoarding Button
export function OnBoardingButton(
  props: {
    children?: JSX.Element;
  } & BoxProps,
) {
  return (
    <Button
      fill={theme.palette.accent}
      stroke={theme.palette.text}
      raised
      width={onBoardingContentWidth}
      overrideProps={props}
    >
      {props.children}
    </Button>
  );
}
