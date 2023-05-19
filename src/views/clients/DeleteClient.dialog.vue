<script setup lang="ts">
// import { PropType } from "vue";
import { pageTransitions, popPage } from "@/Nav";
import { Client } from "@/firebase";
import { PropType, VNodeRef, ref } from "vue";

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
  // message: {
  //   type: String,
  //   required: true,
  // },
});
const cardRef = ref<VNodeRef | null>(null);

function closePopUp() {
  popPage();
}
function handleYes() {
  closePopUp();
  props.client.deleteDoc();
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
    @click="popOnClickOutside"
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
      <Text :sty="{ height: -1, overflowY: $Overflow.wrap }">
        Are you sure you want to permanently delete "{{ client.clientId ?? `` }}
        {{ client.clientId && client.name ? ` - ` : `` }}
        {{ client.name ?? `` }}"?
      </Text>
      <Row :sty="{ width: `1f`, spacing: $Spacing.spaceEvenly }">
        <Button outlined @click.stop="handleYes">Yes</Button>
        <Button @click.stop="closePopUp">No</Button>
      </Row>
    </Card>
  </Box>
</template>
