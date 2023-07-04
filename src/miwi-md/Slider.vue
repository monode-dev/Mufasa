<script setup lang="ts">
import { ref, defineProps, PropType } from "vue";
import { mdColors } from "./Box/BoxDecoration";

const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  value: {
    type: Number,
    optional: true,
    default: 0.5,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:value"]);

const thumbHeight = 1;
const trackHeight = 0.5;
let isDragging = ref(false);
let slider = ref<any>(null);

function updateValue(clientX: number) {
  const rect = slider.value.$el.getBoundingClientRect();
  const newValue =
    ((clientX - rect.left) / rect.width) * (props.max - props.min) + props.min;
  const clampedValue = Math.max(props.min, Math.min(props.max, newValue));
  emit(`update:value`, clampedValue);
}

function startDrag(event: MouseEvent | TouchEvent) {
  isDragging.value = true;
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("touchmove", doDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
  updateValue("touches" in event ? event.touches[0].clientX : event.clientX);
}

function doDrag(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;
  updateValue("touches" in event ? event.touches[0].clientX : event.clientX);
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener("mousemove", doDrag);
  document.removeEventListener("touchmove", doDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
}
</script>

<template>
  <Box
    ref="slider"
    :sty="{
      width: `1f`,
      height: thumbHeight,
      align: $Align.centerLeft,
      axis: $Axis.stack,
    }"
  >
    <Box
      :sty="{
        width: `1f`,
        height: trackHeight,
        cornerRadius: 0.25,
        background: `lightgrey`,
      }"
    />
    <Row
      :sty="{
        width: `1f`,
        height: `1f`,
        align: $Align.centerLeft,
      }"
    >
      <Box
        :sty="{
          width: `${Math.min(
            100,
            Math.max(0, 100 * ((value - min) / (max - min))),
          )}%`,
          height: trackHeight,
          cornerRadius: 0.25,
          background: mdColors.green,
        }"
      />
      <Box
        :sty="{
          width: 0,
          height: 0,
          overflowX: $Overflow.forceStretchParent,
          overflowY: $Overflow.forceStretchParent,
        }"
      >
        <Box
          @mousedown.stop="startDrag"
          @touchstart.stop="startDrag"
          :sty="{
            width: thumbHeight,
            height: thumbHeight,
            cornerRadius: thumbHeight / 2,
            background: mdColors.green,
            // shadowDirection: $Align.center,
            // shadowSize: thumbHeight,
          }"
        />
      </Box>
    </Row>
  </Box>
  <!-- <div
      @mousedown="startDrag"
      @touchstart="startDrag"
    ></div> -->
</template>
