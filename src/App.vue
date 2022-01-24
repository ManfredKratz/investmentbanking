<template>
  <v-app>
    <template v-if="isLoggedIn === true">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      width="249" app
      color="#FAFBFC">
      <v-list dense>
        <template v-for="item in navItems">
          <v-row v-if="item.heading" :key="item.heading" align="center"></v-row>
          <v-list-item v-else :key="item.text" :to="item.link" link >
            <v-list-item-action class="ml-2 mt-3">
              <v-icon color="#202124">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title color="#202124">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    </template>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app class="gradient" height="65" dark flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="">
        <v-btn icon large>
          <v-img src="../src/assets/logo.png" height="35"  width="60" contain />
        </v-btn>
        <span class="subtitle-1 font-weight-medium ml-1">
          LION&nbsp;
          <span class="font-weight-light">INVESTMENT</span>
        </span>
      </v-toolbar-title>
      <v-spacer />
      <template v-if="isLoggedIn === true">
      <ProfilComponent></ProfilComponent>
      </template>
    </v-app-bar>
    <!-- Komponenten-Render -->
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import ProfilComponent from '../src/components/others/Profil.vue';

export default {
  components: {
    ProfilComponent,
  },
  data: () => ({
    navItems: [
      { icon: "mdi-account", text: "Kundenverwaltung", link: "/customer" },
      { icon: "mdi-chart-bar",  text: "Investmentfonds", link: "/funds" },
      { icon: "mdi-account-box", text: "Berater", link: "/consultant" },
    ],
    drawer: true,
    sheet: false,
    fav: true,
    menu: false,
    message: false,
    hints: true,
    isLoggedIn: false,
  }),
    created() {
    if (localStorage.getItem("token")) {
      this.isLoggedIn = true
    }
  },
};
</script>

<style>
/* Centralized gradient-color */
.gradient {
  background: rgb(2, 0, 36);
  background: linear-gradient(90deg, #141e30 10%, #243b55 80%);
}

.gradient-1 {
  background: rgb(2, 0, 36);
  background: linear-gradient(90deg, #1B2B40 10%, #243b55 80%);
}
</style>