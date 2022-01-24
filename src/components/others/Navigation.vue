<template>
  <v-navigation-drawer
    v-model="drawer"
    :clipped="$vuetify.breakpoint.lgAndUp"
    width="249"
    app
    color="#FAFBFC"
  >
    <v-list dense>
      <template v-for="item in navItems">
        <v-row v-if="item.heading" :key="item.heading" align="center"></v-row>
        <v-list-item v-else :key="item.text" :to="item.link" link>
          <v-list-item-action class="ml-2 mt-3">
            <v-icon color="#202124">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title color="#202124">{{
              item.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
export default {
  data: () => ({
    drawer: true,
    navItems: [
      { icon: "mdi-account", text: "Kundenverwaltung", link: "/customer" },
      { icon: "mdi-chart-bar", text: "Investmentfonds", link: "/funds" },
      { icon: "mdi-account-box", text: "Berater", link: "/consultant" },
    ],
  }),
};
</script>
