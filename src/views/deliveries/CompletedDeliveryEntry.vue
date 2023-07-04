<script setup lang="ts">
import { CompletedDelivery, Delivery, getClientLabel } from "@/AppData";
import { PropType } from "vue";
import { exists } from "@/utils";
import { pushPage } from "@/Nav";
import CompleteDeliveryDialog from "./CompleteDelivery.dialog.vue";

const props = defineProps({
  sty: {
    type: Object as PropType<Sty>,
    default: {},
  },
  delivery: {
    type: Object as PropType<Delivery>,
    required: true,
  },
});

function handleEdit() {
  pushPage(CompleteDeliveryDialog, {
    dialogType: `edit`,
    delivery: props.delivery,
  });
}

// Tue, March 10th 2021 - 3:00 PM
function formatPosixTime(posixTime: number) {
  // Create a new Date object from the posix time
  let date = new Date(posixTime);

  // Array of day names
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the day of the week, the month and the date
  let dayOfWeek = days[date.getDay()];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  // Add the ordinal suffix
  let suffix = "";
  switch (day % 10) {
    case 1:
      suffix = day === 11 ? "th" : "st";
      break;
    case 2:
      suffix = day === 12 ? "th" : "nd";
      break;
    case 3:
      suffix = day === 13 ? "th" : "rd";
      break;
    default:
      suffix = "th";
  }

  // Get the year
  let year = date.getFullYear();

  // Return the formatted string
  return `${dayOfWeek}, ${month} ${day}${suffix} ${year} - ${time}`;
}
</script>

<template>
  <Card :sty="{ width: `1f`, ...props.sty }">
    <Row
      :sty="{
        width: `1f`,
        align: $Align.spaceBetween,
      }"
    >
      <Text hint :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }">{{
        exists(delivery.completedTimePosix)
          ? formatPosixTime(delivery.completedTimePosix)
          : `Unknown Date`
      }}</Text>
      <DeleteOptionsButton shouldShowEdit @edit="handleEdit" />
    </Row>

    <Label label="Client">
      <Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }">{{
        delivery.completedClientLabel
      }}</Text>
    </Label>

    <Row
      :sty="{
        width: `1f`,
        padBetween: 0.25,
      }"
    >
      <Label label="Amount"
        ><Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >{{ delivery.quantity }} Gal.</Text
        ></Label
      >
      <Label label="Fuel"
        ><Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }">{{
          delivery.completedFuelTypeName
        }}</Text></Label
      >
    </Row>
    <Row
      :sty="{
        width: `1f`,
        padBetween: 0.25,
      }"
    >
      <Label label="Rate"
        ><Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >${{ delivery.completedRate }}</Text
        ></Label
      >
      <Label label="Total"
        ><Text :sty="{ width: `1f`, align: $Align.centerLeft, height: 1 }"
          >${{
            (
              Math.round(
                (delivery.quantity ?? 0) * (delivery.completedRate ?? 0) * 100,
              ) / 100
            ).toFixed(2)
          }}</Text
        ></Label
      >
    </Row>
  </Card>
</template>
