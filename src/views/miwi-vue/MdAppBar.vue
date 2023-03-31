<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import B, { Align, mdColors, Axis, Sty } from './B.vue';

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
});
</script>

<template>
  <B :sty="{
    width: `1f`,
    background: mdColors.green,
    shadowSize: 1.25,
    shadowDirection: Align.bottomCenter,
    align: Align.bottomCenter,
    textColor: mdColors.white,
    ...props.sty,
  }">
    <!-- Main Row -->
    <B :sty="{
      width: `1f`,
      axis: Axis.row,
      padding: 0.5,
      textSize: 1.5,
    }">
      <!-- Left -->
      <B :sty="{
        width: `1f`,
        align: Align.centerLeft,
      }">
        <slot name="left"></slot>
      </B>

      <!-- Title / Center -->
      <B :sty="{
        width: `2f`,
        align: Align.center,
        textIsBold: true,
      }">
        <slot name="title"></slot>
      </B>
      
      <!-- Right -->
      <B :sty="{
        width: `1f`,
        align: Align.centerRight,
      }">
        <slot name="right"></slot>
      </B>
    </B>

    <!-- Bottom Row -->
    <B :sty="{
      width: `1f`,
      textSize: 1,
    }">
      <slot name="bottom"></slot>
    </B>
  </B>
</template>