<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      top
      transition="slide-x-transition"
      offset-x
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn text small v-on="on" class="font-weight-regular">
          <v-icon small>mdi-account-circle</v-icon>Profil
        </v-btn>
      </template>
      <v-card>
        <v-card-text class="caption mr-2">
          <div class="d-flex">
            <div>
              <v-icon x-large left>mdi-account-circle</v-icon>
            </div>
            <div>
              <div class="body-2">
                {{ userdata.firstname }} {{ userdata.lastname }}
              </div>
              <div class="">{{ userdata.email }}</div>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="caption ml-4">
            <template v-if="userdata.is_admin === true"> Admin </template>
            <template v-else> Berater </template>
          </div>
          <v-spacer />
          <v-btn
            text
            color="#333333"
            x-small
            class="font-weight-medium"
            @click="logOut()"
          >
            Abmelden
            <v-icon x-small class="ml-1">mdi-exit-to-app</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import { bus } from "../../main";

export default {
  data() {
    return {
      menu: null,
      name: "",
      userdata: {},
      isLoggedIn: false,
    };
  },
  created() {
    this.fetchUserDetails();
    this.SetUserData();
  },
  methods: {
    SetUserData() {
      bus.$emit("UserDataChannel", this.userdata);
    },
    fetchUserDetails() {
      const token = localStorage.getItem("token");
      const TokenPayload = VueJwtDecode.decode(token);
      this.userdata.consultant_id =
        TokenPayload.user_information[0].consultant_id;
      this.userdata.bo_id = TokenPayload.user_information[0].bo_id;
      this.userdata.email = TokenPayload.user_information[0].email;
      this.userdata.firstname = TokenPayload.user_information[0].firstname;
      this.userdata.lastname = TokenPayload.user_information[0].lastname;
      this.userdata.qualification =
        TokenPayload.user_information[0].qualification;
      this.userdata.is_admin = TokenPayload.user_information[0].is_admin;
    },
    logOut() {
      this.$router.push("/login");
      localStorage.removeItem("token");
      this.$router.go();
      this.userdata = {};
    },
  },
  computed: {
    updateUserDetails() {
      return this.userdata;
    },
  },
};
</script>