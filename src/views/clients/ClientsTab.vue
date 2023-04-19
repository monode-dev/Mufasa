<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";
import { Sty, Axis, Align, mdColors, Spacing, Overflow } from "@/miwi-md/B.vue";
import addSvg from "@/assets/add_FILL1_wght400_GRAD0_opsz48.svg";
</script>

<template>
  <B
    :sty="{
      width: `1f`,
      height: `1f`,
      axis: Axis.column,
    }"
  >
    <B
      :sty="{
        width: `1f`,
        background: mdColors.green,
        axis: Axis.row,
        padding: 0.5,
        shadowSize: 1.25,
        shadowDirection: Align.bottomCenter,
        spacing: 0.5,
        // cornerRadius: [0, 0, 0.75, 0.75],
      }"
    >
      <B
        :sty="{
          width: `1f`,
          padding: 0.25,
          cornerRadius: 0.75,
          align: Align.centerLeft,
          background: mdColors.white,
          textColor: mdColors.grey,
          axis: Axis.row,
        }"
      >
        <B :sty="{ width: 0.25 }" />
        Add New or Search
        <B :sty="{ width: 0.25 }" />
      </B>
      <B
        :sty="{
          align: Align.center,
          textColor: mdColors.white,
        }"
      >
        <Icon :size="1.5" :icon="addSvg" alt="Add Icon" />
      </B>
    </B>

    <!-- Body -->
    <Body>
      <ClientEntry name="A&P Logging"></ClientEntry>
      <ClientEntry name="Aaron Hohman"></ClientEntry>
      <ClientEntry name="Abigail Rodgers"></ClientEntry>
      <ClientEntry name="Advanced Tree Service"></ClientEntry>
      <ClientEntry name="Affordable Lawn Care"></ClientEntry>
      <ClientEntry name="Airport Fire Station"></ClientEntry>
      <ClientEntry name="Alan Battenfield"></ClientEntry>
      <ClientEntry name="Alanna Keneshiro"></ClientEntry>
      <ClientEntry name="Alice Conner"></ClientEntry>
      <ClientEntry name="All Creatures Animal Hospital"></ClientEntry>
      <ClientEntry name="All In One Rental"></ClientEntry>
      <ClientEntry name="Alyshia Peck"></ClientEntry>
      <ClientEntry name="Amy's Kitchen"></ClientEntry>
      <ClientEntry name="Ancheta Holdings"></ClientEntry>
      <ClientEntry name="Andrew Barnes"></ClientEntry>
      <ClientEntry name="Andrew Watson"></ClientEntry>
      <ClientEntry name="Andy Pollack"></ClientEntry>
      <ClientEntry name="Anthony Molle"></ClientEntry>
      <ClientEntry name="Applegate Store"></ClientEntry>
      <ClientEntry name="Art of Plumbing"></ClientEntry>
      <ClientEntry name="Asante"></ClientEntry>
      <ClientEntry name="Ashland Bus Shop"></ClientEntry>
      <ClientEntry name="Ashland Parks & Recreation"></ClientEntry>
      <ClientEntry name="Aurupa Spring Ranch"></ClientEntry>
      <ClientEntry name="Bart Cunningham"></ClientEntry>
      <ClientEntry name="Bart Masciarelli"></ClientEntry>
      <ClientEntry name="BBMD-Medford, Boise Phoenix"></ClientEntry>
      <ClientEntry name="Bear Creek Orchard"></ClientEntry>
    </Body>
  </B>
</template>
