<template>
  <Box
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
          width: `50%`,
          height: trackHeight,
          cornerRadius: 0.25,
          background: mdColors.green,
        }"
      />
      <Box
        :sty="{
          width: 0,
          height: 0,
          overflowX: `visible`,
          overflowY: `visible`,
        }"
      >
        <Box
          :sty="{
            width: thumbHeight,
            height: thumbHeight,
            cornerRadius: thumbHeight / 2,
            background: mdColors.green,
            shadowDirection: $Align.center,
            shadowSize: thumbHeight,
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, CSSProperties } from "vue";
import { mdColors } from "@/miwi-md/Box.vue";

const thumbHeight = 1;
const trackHeight = 0.5;

let min = 0;
let max = 100;
let value = ref(50);
let isDragging = ref(false);

let slider = ref(null);
let thumb = ref(null);

let sliderStyles: CSSProperties = {
  position: "relative",
  height: "4px",
  background: "#ddd",
};
let trackStyles: CSSProperties = {
  position: "absolute",
  height: "100%",
  background: "#3f51b5",
  width: `${value.value}%`,
};
let thumbStyles: CSSProperties = {
  position: "absolute",
  top: "-6px",
  height: "16px",
  width: "16px",
  background: "#fff",
  borderRadius: "50%",
  boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
  left: `${value.value}%`,
};

const updateValue = (clientX: number) => {
  const rect = (slider.value! as HTMLElement).getBoundingClientRect();
  const newValue = ((clientX - rect.left) / rect.width) * (max - min);
  value.value = Math.max(min, Math.min(max, newValue));
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("touchmove", doDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
  updateValue("touches" in event ? event.touches[0].clientX : event.clientX);
};

const doDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;
  updateValue("touches" in event ? event.touches[0].clientX : event.clientX);
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", doDrag);
  document.removeEventListener("touchmove", doDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
};

watch(value, (newValue) => {
  thumbStyles.left = `${newValue}%`;
  trackStyles.width = `${newValue}%`;
});
</script>
