<script setup lang="ts">
import ClientEntry from '@/views/clients/ClientEntry.vue';
import MdBody from '@/views/miwi-vue/MdBody.vue';
import B, { Sty, Axis, Align ,mdColors, Spacing, Overflow }  from '../miwi-vue/B.vue';
import Icon from '@/views/miwi-vue/Icon.vue';
import addSvg from '@/assets/add_FILL1_wght400_GRAD0_opsz48.svg';
</script>

<template>
  <B :sty="{
    width: `1f`,
    height: `1f`,
    axis: Axis.stack,
  }">
    <MdBody>
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
    </MdBody>

    <!-- Add Button-->
    <B :sty="{
      width: `1f`,
      height: `1f`,
      isInteractable: false,
      align: Align.bottomRight,
      padding: 1,
    }">
      <B :sty="{
        width: 3,
        height: 3,
        background: mdColors.green,
        cornerRadius: 1.5,
        shadowDirection: Align.bottomRight,
        shadowSize: 2,
        textSize: 2,
        textColor: mdColors.white,
        isInteractable: true,
      }">
        <!--@click="pushPage(pages.settings)"-->
        <Icon :size="2" :icon="addSvg" alt="Add Icon"/>
      </B>
    </B>
  </B>
  <!-- <div style="width: 100%; height: 100%;">
    <div :style="{
      background: `transparent`,
      width: `100%`,
      height: `100%`,
      position: `relative`,
      pointerEvents: `none`,
    }">
    </div>
    <div :style="{
      background: `transparent`,
      width: `100%`,
      height: `100%`,
      position: `absolute`,
      pointerEvents: `none`,
      zIndex: 1,
    }">
      <B :sty="{
        width: `100%`,
        height: `100%`,
        padding: 1,
        align: Align.bottomRight,
      }">
        <B :sty="{
          width: 2,
          height: 2,
          background: mdColors.green,
          cornerRadius: 1,
          shadowDirection: Align.bottomRight,
          shadowSize: 2,
          textColor: mdColors.white,
        }">
          A
        </B>
      </B>
    </div>
  </div> -->
</template>
