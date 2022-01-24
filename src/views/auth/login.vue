<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center"></div>
      <v-card width="500" class="mt-10 text-center">
        <v-toolbar flat color="gradient" class="body-2" dark>
          <v-icon left small>mdi-login</v-icon>Authentifizierung
        </v-toolbar>
        <v-card-text class="pa-4">
          <form @submit.prevent="loginUser">
            <v-text-field v-model="email" label="Email" placeholder=" " required />
            <v-text-field v-model="password" label="Password" placeholder=" " type="password" required />
            <div class="errorMsg">{{errorMsg}}</div>
            <v-btn type="submit" small depressed color="#243B55" dark>Anmelden</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script src="../../../src/middleware/login.js"></script>