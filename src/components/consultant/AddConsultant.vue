<template>
  <v-dialog v-model="addConsultant" persistent>
    <template v-slot:activator="{ on }">
      <v-btn small depressed v-on="on" color="#243B55" dark>
        <v-icon small left>mdi-plus</v-icon>Berater anlegen
      </v-btn>
    </template>
    <v-sheet>
      <v-toolbar class="gradient" height="3px" flat></v-toolbar>
      <v-card-title class="subtitle pl-4">
        <v-icon left>mdi-account</v-icon>Berater anlegen
        <v-spacer />
        <v-btn class="mr-5" depressed dark small color="#1E3047" @click="addNewOneConsultant()">
          <v-icon small left>mdi-check</v-icon>Speichern
        </v-btn>
        <v-btn small color="#F3F3F3" depressed @click="closeAddConsultant()">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-card-title>
      <v-stepper v-model="nextStep" class="smallFont elevation-0">
        <v-stepper-items class="justify-center">
          <!-- Schritt 1 - Angabe der Filliale -->
          <v-stepper-content step="1">
            Bitte wählen Sie aus für welche
            <b>Filiale</b>
            sie einen Berater anlegen möchten.
            <v-select
              :items="branch_offices"
              v-model="selectedCity"
              filled
              label="Filliale auswählen"
              class="mt-2"
            ></v-select>
            <div class="errorMsg">{{errorMsg}}</div>
            <v-btn class="mr-3" depressed dark small color="#1E3047" @click="checkSelected()">
              <v-icon small left>mdi-check</v-icon>Weiter
            </v-btn>
            <v-btn color="#1E3047" text small @click="closeAddConsultant()">Abbrechen</v-btn>
          </v-stepper-content>
          <!-- Schritt 2 - Angaben zum Berater -->
          <v-stepper-content step="2">
            <v-card flat class="mb-3">
              Sie legen einen neuen Berater für die Filliale in
              <b>{{selectedCity}}</b> an.
            </v-card>
            <div class="pt-1">
              <v-form ref="form">
                <div class="overline font-weight-bold mb-1">Angaben zum Berater</div>
                <v-row class="mb-4">
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      :items="title"
                      dense
                      v-model="selectedTitle"
                      filled
                      label="Anrede"
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      dense
                      label="Vorname"
                      v-model="newConsultant.firstname"
                      filled
                      placeholder=" "
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      dense
                      label="Nachname"
                      v-model="newConsultant.lastname"
                      filled
                      placeholder=" "
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      :items="qualification"
                      dense
                      v-model="selectedQualification"
                      filled
                      label="Qualifikation"
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                </v-row>
                <div class="overline font-weight-bold mb-1">Logindaten</div>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      dense
                      label="E-Mail"
                      v-model="newConsultant.email"
                      filled
                      placeholder=" "
                      :rules="[rules.required, rules.email]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field
                      dense
                      label="Passwort"
                      v-model="newConsultant.password"
                      filled
                      placeholder=" "
                      :rules="[rules.required, rules.min6Chars]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-select
                      :items="adminState"
                      dense
                      v-model="selectedAdmin"
                      filled
                      label="Adminrechte"
                      :rules="[rules.required]"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </div>
            <v-btn color="#1E3047" text small @click="nextStep = 1">Zurück</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-sheet>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";

export default {
  data() {
    return {
      addConsultant: false,
      nextStep: 1,
      selectedCity: {},
      selectedTitle: {},
      selectedQualification: {},
      selectedAdmin: {},
      errorMsg: null,
      branch_offices: [
        "Stuttgart",
        "Dillingen",
        "Heidenheim",
        "Göppingen",
        "Ulm"
      ],
      title: ["Herr", "Frau"],
      qualification: ["Berater", "Admin", "Boss", "2nd Boss"],
      adminState: ["true", "false"],
      newConsultant: [
        {
          title: null,
          firstname: null,
          lastname: null,
          qualification: null,
          email: null,
          password: null,
          is_admin: null,
          bo_city: null
        }
      ],
      rules: {
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben.",
        min6Chars: value =>
          value.length >= 6 || "Das Passwort muss min. 6 Zeichen lang sein."
      },
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (
          pattern.test(value) ||
          "Bitte geben Sie eine gültige E-Mail Adresse ein."
        );
      }
    };
  },
  methods: {
    closeAddConsultant() {
      this.addConsultant = !this.addConsultant;
      this.nextStep = 1;
      this.errorMsg = null;
      this.selectedCity = {};
    },
    checkSelected() {
      if (Object.keys(this.selectedCity).length === 0) {
        this.nextStep = 1;
        this.errorMsg = "Bitte wählen Sie eine Filliale aus um fortzufahren.";
      } else {
        this.nextStep = 2;
        this.errorMsg = null;
      }
    },
    addNewOneConsultant() {
      if (this.$refs.form.validate()) {
        let addNewOneUser = {
          bo_city: this.selectedCity,
          title: this.selectedTitle,
          firstname: this.newConsultant.firstname,
          lastname: this.newConsultant.lastname,
          qualification: this.selectedQualification,
          email: this.newConsultant.password,
          password: this.newConsultant.password,
          is_admin: this.selectedAdmin
        };
        axios
          .post("http://localhost:8000/user/create", addNewOneUser)
          .then(response => {
            console.log(response);
            console.log(addNewOneUser);
            bus.$emit("consultant-updated");
          })
          .catch(error => {
            console.log(error);
          });
        this.addConsultant = false;
      }
    }
  }
};
</script>

<style>
.errorMsg {
  font-size: 12px;
  color: red;
  margin-bottom: 10px;
}
</style>















