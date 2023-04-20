<script setup lang="ts">
import { ref, watchEffect } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";
import { count, incCount } from "@/firebase";

// Confetti
const shouldShowConfetti = ref(false);
const confettiRunCount = ref(0);
watchEffect(async () => {
  confettiRunCount.value++;
  if (count.value % 10 !== 0) return;
  if (confettiRunCount.value < 3) return;
  shouldShowConfetti.value = true;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  shouldShowConfetti.value = false;
});
</script>

<template>
  <Body :sty="{ align: $Align.center }">
    <Box>
      Database Sync Tester
      <component :is="ConfettiExplosion" v-if="shouldShowConfetti" :force="0.75" :duration="3000" :stageHeight="2000"
        :stageWidth="1500" />
    </Box>
    <Button @click="incCount"> Count: {{ count }} </Button>
  </Body>
</template>
