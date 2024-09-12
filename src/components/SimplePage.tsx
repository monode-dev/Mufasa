import { BoxProps, Column, exists, Page } from "miwi";
import { JSX } from "solid-js";
import { premiumEnabled } from "@/model/DataModel";
import { ContactDevsButton } from "./ContactDevsButton";
// import { UploadingIndicator } from "./UploadingIndicator";

export const pagePadding = 1.25;

export function SimplePage(
  props: {
    floating?: JSX.Element;
    floatBoxStyle?: BoxProps;
    hideContactDevs?: boolean;
  } & BoxProps,
) {
  return (
    // TODO: For some reason the page squishes with the keyboard.
    <Page stack scale={1}>
      {/* Page */}
      <Column widthGrows heightGrows overrideProps={props} padBetween={0}>
        {props.children}
      </Column>

      {/* Upload Indicator */}
      {/* <Show when={mfs.}>
        <Box asWideAsParent asTallAsParent alignBottomLeft pad={pagePadding}>
          <UploadingIndicator />
        </Box>
      </Show> */}

      {/* Floating Elements */}
      <Column
        widthGrows
        heightGrows
        alignBottomRight
        pad={pagePadding}
        zIndex={3}
        overrideProps={props.floatBoxStyle}
      >
        {exists(props.floating) ? (
          props.floating
        ) : premiumEnabled.value ? (
          <ContactDevsButton />
        ) : undefined}
      </Column>
    </Page>
  );
}
