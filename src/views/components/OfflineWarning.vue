<script setup lang="ts">
import { ref } from "vue";
import { mdColors, sizeToCss } from "@/miwi-md/Box.vue";
import { Network } from "@capacitor/network";
import { pageTransitions } from "@/Nav";

const hasInternet = ref(true);
Network.getStatus().then((status) => (hasInternet.value = status.connected));
Network.addListener("networkStatusChange", (status) => {
  hasInternet.value = status.connected;
});
const offlineWarningTransitions = pageTransitions.from({
  duration: 0.15,
  y: sizeToCss(4),
  ease: "power1.out",
});
</script>

<template>
  <Transition appear @enter="offlineWarningTransitions.enter" @leave="offlineWarningTransitions.leave">
    <div v-if="!hasInternet" :style="{
        background: `transparent`,
        width: `100%`,
        height: `100%`,
        bottom: 0,
        left: 0,
        position: `absolute`,
        pointerEvents: `none`,
        zIndex: 999999998,
      }">
      <Box :sty="{
          width: `100%`,
          height: `100%`,
          padding: 1,
          align: $Align.bottomLeft,
        }">
        <Box :sty="{
            background: mdColors.orange,
            textColor: mdColors.white,
            cornerRadius: 1,
            shadowDirection: $Align.center,
            shadowSize: 2,
            padding: 0.5,
            axis: $Axis.row,
            spacing: 0.5,
          }">
          <Icon :scale="1" icon="wifiOff" />
          Will Sync When Online
        </Box>
      </Box>
    </div>
  </Transition>
</template>
