<script setup lang="ts">
import ClientEntry from "@/views/clients/ClientEntry.vue";

const clientNames = [
  `A&P Logging`,
  `Aaron Hohman`,
  `Abigail Rodgers`,
  `Advanced Tree Service`,
  `Affordable Lawn Care`,
  `Airport Fire Station`,
  `Alan Battenfield`,
  `Alanna Keneshiro`,
  `Alice Conner`,
  `All Creatures Animal Hospital`,
  `All In One Rental`,
  `Alyshia Peck`,
  `Amy's Kitchen`,
  `Ancheta Holdings`,
  `Andrew Barnes`,
  `Andrew Watson`,
  `Andy Pollack`,
  `Anthony Molle`,
  `Applegate Store`,
  `Art of Plumbing`,
  `Asante`,
  `Ashland Bus Shop`,
  `Ashland Parks & Recreation`,
  `Aurupa Spring Ranch`,
  `Bart Cunningham`,
  `Bart Masciarelli`,
  `BBMD-Medford, Boise Phoenix`,
  `Bear Creek Orchard`,
] as const;
</script>

<template>
  <Column :sty="{ width: `1f`, height: `1f` }">
    <ClientSearchBar />

    <Body>
      <ClientEntry v-for="name in clientNames" :name="name"></ClientEntry>
    </Body>
    <!-- <Stack :sty="{
        width: `1f`,
        height: `1f`,
      }">

        <Body>
          <ClientEntry v-for="name in clientNames" :name="name"></ClientEntry>
        </Body>
        <Box :sty="{
          width: `1f`,
          height: `1f`,
          align: Align.bottomRight,
          padding: 0.5,
        }">
          <Button raised round :sty="{ width: 2, height: 2, scale: 1.5 }">
            <Icon :size="1.5" :icon="addSvg" alt="Add Icon" />
          </Button>
        </Box>
      </Stack> -->
  </Column>
</template>
