<script setup lang="ts">
import { defineProps, PropType, ref } from "vue";
import { mdColors } from "@/miwi-md/Box/BoxDecoration";
import { pushPage } from "@/Nav";
import CreateClientDialog from "./CreateClient.dialog.vue";

// Allow overriding of the default sty
const props = defineProps({
  sty: {
    type: Object as PropType<Partial<Sty>>,
    default: {},
  },
  filterString: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:filterString"]);

enum Mode {
  Home = "Home",
  Search = "Search",
  New = "New",
  Import = "Import",
  Export = "Export",
}
const mode = ref(Mode.Home);
</script>

<template>
  <ClientSearchBar
    v-if="mode === Mode.Search"
    @close="mode = Mode.Home"
    :filterString="props.filterString"
    @update:filterString="emit('update:filterString', $event)"
  />
  <Row
    v-else
    :sty="{
      width: `1f`,
      background: mdColors.green,
      padding: `0.5 0`,
      shadowSize: 1.25,
      shadowDirection: $Align.bottomCenter,
      spacing: $Spacing.spaceEvenly,
      zIndex: 2,
      ...sty,
    }"
  >
    <OutlinedActionButton
      label="Search"
      icon="magnify"
      @click.stop="mode = Mode.Search"
    />
    <OutlinedActionButton
      label="New"
      icon="plus"
      @click.stop="pushPage(CreateClientDialog)"
    />
    <OutlinedActionButton label="Import" icon="import" />
    <OutlinedActionButton label="Export" icon="export" />
  </Row>
</template>
