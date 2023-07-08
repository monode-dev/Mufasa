<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import { Client } from "@/AppData";
import { PropType, VNodeRef, ref } from "vue";
import { Doc } from "@/mufasa/Implement";

const props = defineProps({
  obj: {
    type: Object as PropType<Doc>,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
const cardRef = ref<VNodeRef | null>(null);

function closePopUp() {
  popPage();
}
function handleYes() {
  closePopUp();
  props.obj.deleteDoc();
}

// Close the pop up when the user clicks outside of it
function popOnClickOutside(e: MouseEvent) {
  if (!cardRef.value?.$el.contains(e.target)) {
    closePopUp();
    e.stopPropagation();
  }
}
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.fadeIn(),
};
</script>

<template>
  <Box
    :onClick="popOnClickOutside"
    :sty="{
      width: `1f`,
      height: `1f`,
      background: `#00000099`,
    }"
  >
    <Card
      ref="cardRef"
      :sty="{
        width: `75%`,
        shadowSize: 0,
      }"
    >
      <Text :sty="{ height: -1, width: `1f`, overflowX: $Overflow.wrap }">
        {{ message }}
      </Text>
      <Row :sty="{ width: `1f`, align: $Align.spaceEvenly }">
        <Button outlined :onClick="handleYes">Yes</Button>
        <Button :onClick="closePopUp">No</Button>
      </Row>
    </Card>
  </Box>
</template>
