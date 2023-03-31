<script setup lang="ts">
import { defineProps, PropType, computed } from 'vue';
import B, { Align, mdColors, Axis, Spacing, Sty } from '@/views/utils/B.vue';

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
    textSize: 1,
    ...props.sty,
  }">
    <B :sty="{
      width: `1f`,
      axis: Axis.row,
      padding: 0.5,
    }">
      <B :sty="{
        width: `1f`,
        axis: Axis.row,
      }">
        <B :sty="{
          width: `1f`,
          align: Align.centerLeft,
        }">
          <slot name="left"></slot>
        </B>
        <B :sty="{
          width: `2f`,
          align: Align.center,
          textColor: mdColors.white,
          textSize: 1.5,
          textIsBold: true,
        }">
          <slot name="title"></slot>
        </B>
        <B :sty="{
          width: `1f`,
          align: Align.centerRight,
        }">
          <slot name="right"></slot>
        </B>
      </B>
    </B>
    <B :sty="{
      width: `1f`,
    }">
      <slot name="bottom"></slot>
    </B>
  </B>
</template>