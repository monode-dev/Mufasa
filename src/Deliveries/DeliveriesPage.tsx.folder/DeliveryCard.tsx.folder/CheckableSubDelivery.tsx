import CompleteSubDeliveryDialog from "@/Deliveries/CompleteSubDeliveryDialog";
import { ConfirmSubDeliveryUncompletion } from "@/Deliveries/ConfirmSubDeliveryUncompletion";
import { SubDelivery } from "@/Deliveries/Delivery";
import { mdiCheck } from "@mdi/js";
import {
  useFormula,
  Row,
  Box,
  pushPage,
  Icon,
  mdColors,
  Txt,
  doNow,
} from "miwi";
import { Show } from "solid-js";

export function CheckableSubDelivery(props: {
  subDelivery: SubDelivery;
  showCard?: boolean;
}) {
  const highlightColor = useFormula(() =>
    props.subDelivery.isCompleted
      ? $theme.colors.hint
      : props.subDelivery.isValid
      ? undefined
      : $theme.colors.warning,
  );
  return (
    <>
      {/* <Show when={props.subDelivery.isCompleted}>
        <Txt>
          {props.subDelivery.selectedKnownTank?.fuelType?.name}:
          {props.subDelivery.stickedInchesBeforeFilling}" -{">"}{" "}
          {props.subDelivery.stickedInchesAfterFilling}",
          {roundToString(
            getTankShape(
              props.subDelivery.selectedKnownTank?.shape,
            )?.calcTotalVolume(props.subDelivery.selectedKnownTank) ?? 0,
            0,
          )}{" "}
          gal. -{">"} {props.subDelivery.gallons} gal.
        </Txt>
      </Show> */}
      <Row alignTopLeft widthGrows>
        <Box
          /* We want the check box to be vertically centered with a single line of
           * text. However, the text is not vertically centered in its bounding box.
           * So we apply a slight offset here to vertically align the check box with
           * the first line of the description text. */
          padTop={0.045}
        >
          <Box
            onClick={() =>
              props.subDelivery.isCompleted
                ? pushPage(ConfirmSubDeliveryUncompletion, {
                    subDelivery: props.subDelivery,
                  })
                : pushPage(CompleteSubDeliveryDialog, {
                    subDelivery: props.subDelivery,
                  })
            }
            width={1}
            height={1}
            outlineSize={1 / 8}
            outlineColor={highlightColor.value ?? $theme.colors.primary}
            cornerRadius={1 / 7}
            fill={
              props.subDelivery.isCompleted ? $theme.colors.hint : undefined
            }
          >
            <Show when={props.subDelivery.isCompleted}>
              <Icon iconPath={mdiCheck} scale={0.8} stroke={mdColors.white} />
            </Show>
          </Box>
        </Box>
        <Txt
          widthGrows
          asTallAsParent
          overflowXWraps
          alignTopLeft
          stroke={highlightColor.value ?? $theme.colors.text}
        >
          {doNow(() => {
            if (!props.showCard && props.subDelivery.delivery.isCompleted)
              return props.subDelivery.shorterTitle;
            return props.subDelivery.title;
          })}
        </Txt>
      </Row>
    </>
  );
}
