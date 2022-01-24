<template>
  <v-layout class="justify-center">
    <v-row align="center" justify="center" class="mt-10">
      <v-alert type="error" elevation="0" class="align-center" width="75%" dense>
        <span class="caption">Die von Ihnen angeforderte Seite existiert nicht!</span>
      </v-alert>
    </v-row>
  </v-layout>
</template>

<script>
export default {
  name: "NotFound"
};
</script>