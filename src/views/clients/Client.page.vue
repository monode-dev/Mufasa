<script setup lang="ts">
import { PropType } from "vue";
import { pageTransitions } from "@/Nav";
import { Client, defaultClient } from "@/Model";

const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    // required: true,
    default: defaultClient,
  },
});
</script>

<script lang="ts">
export default {
  transitions: pageTransitions.slideUp(),
};
</script>

<template>
  <AppBar
    >Client
    <template #right>
      <SettingsButton />
    </template>
  </AppBar>

  <Body>
    <!-- <v-container>
      <v-card>
        <v-card-text>
          <v-row class="mb-4">
            <v-col cols="12" class="text-center">
              <h3>Client Info</h3>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Name" variant="underlined" v-model="client.name"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Client ID" variant="underlined" v-model="client.clientId"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Phone" variant="underlined" v-model="client.phoneNumber"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-textarea label="Address" variant="underlined" v-model="client.address"></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Notes" variant="underlined" v-model="client.notes"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <v-row class="mb-4">
            <v-col cols="12" class="text-center">
              <h3>Tanks</h3>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="text-center">
              <h3>Deliveries</h3>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>:sty="{ background: `red` }"
    </v-container> -->
    <Card
      title="Client Info"
      :sty="{ width: `1f`, spacing: 1 }"
      :shouldLog="true"
    >
      <Field
        underlined
        hint="Name"
        v-model:value="client.name"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Client ID"
        v-model:value="client.clientId"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Phone"
        v-model:value="client.phoneNumber"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Address"
        v-model:value="client.address"
        :sty="{ width: `1f` }"
      />
      <Field
        underlined
        hint="Notes"
        v-model:value="client.notes"
        :sty="{ width: `1f` }"
      />
    </Card>
    <Card title="Tanks" :sty="{ width: `1f` }">
      <Text hint>Tanks coming soon.</Text>
    </Card>
    <Card title="Deliveries" :sty="{ width: `1f` }">
      <Text hint>Deliveries coming soon.</Text>
    </Card>
  </Body>
</template>
