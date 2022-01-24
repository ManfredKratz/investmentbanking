<template>
  <v-dialog v-model="addCustomer" class="mb-1">
    <template v-slot:activator="{ on }">
      <v-btn text color="#243B55" dark v-on="on" class="ml-2">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </template>
    <v-sheet>
      <v-toolbar class="gradient" height="3px" flat></v-toolbar>
      <v-card-title class="subtitle pl-4 mb-3">
        <v-icon left>mdi-account</v-icon>Kunde anlegen
        <v-spacer />
        <v-btn class="mr-5" depressed dark small color="#1E3047" @click="NewAddCustomer()">
          <v-icon small left>mdi-check</v-icon>Speichern
        </v-btn>
        <v-btn small color="#F3F3F3" depressed @click="addCustomer = !addCustomer">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-card-title>
      <div class="pl-5 pr-5 pt-1">
        <div class="overline font-weight-bold mb-1">Angaben zum Kunden</div>
        <v-form ref="form">
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Vorname"
              v-model="addNewCustomer.firstname"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Nachname"
              v-model="addNewCustomer.lastname"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="E-Mail"
              v-model="addNewCustomer.email"
              filled
              placeholder=" "
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-menu
              v-model="datePicker"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="Geburtsdatum"
                  readonly
                  dense
                  filled
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="datePicker = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <div class="overline font-weight-bold mb-1">Herkunft</div>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="countrys"
              dense
              v-model="selectedCountry"
              placeholder=" "
              filled
              label="Land"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Postleitzahl"
              v-model="addNewCustomer.zip_code"
              filled
              placeholder=" "
              :rules="[rules.required, rules.max5Chars]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="Ort" v-model="addNewCustomer.city" filled placeholder=" " :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Straße + Hausnummer"
              v-model="addNewCustomer.street"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="overline font-weight-bold mb-3">Weitere Angaben</div>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="nationalitys"
              dense
              v-model="selectedNationality"
              placeholder=" "
              filled
              label="Nationalität"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="familys"
              dense
              v-model="selectedFamily_status"
              placeholder=" "
              filled
              label="Familienstand"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              v-model="addNewCustomer.tax_id"
              placeholder=" "
              filled
              label="TAX ID"
              :rules="[rules.required, rules.max11Chars]"
            ></v-text-field>
          </v-col>
        </v-row>
        </v-form>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";
import VueJwtDecode from 'vue-jwt-decode';

export default {
  data() {
    return {
      addCustomer: false,
      datePicker: false,
      date: new Date().toISOString().substr(0, 10),
      selectedCountry: {},
      selectedNationality: {},
      selectedFamily_status: {},
      consultant_id: null,
      countrys: ["Deutschland", "Österreich", "Schweiz", "Frankreich"],
      nationalitys: [
        "Deutsch",
        "Österreichisch",
        "Schweizerisch",
        "Italienisch",
        "Spanisch",
        "Portugiesisch",
        "Französisch",
        "Britisch",
        "Polnisch",
        "Tschechisch"
      ],
      familys: ["Ledig", "Verheiratet", "Verwitwet", "Geschieden"],
      addNewCustomer: [
        {
          consultant_id: null,
          firstname: null,
          lastname: null,
          street: null,
          zip_code: null,
          city: null,
          tax_id: null,
          email: null,
          birthday_date: new Date().toISOString().substr(0, 10)
        }
      ],
      rules: {
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) ||
            "Bitte geben Sie eine gültige E-Mail Adresse ein."
          );
        },
        max5Chars: value =>
          value.length <= 7 ||
          "Eine Postleitzahl darf maximal aus 7 Ziffern bestehen.",
        max11Chars: value =>
          value.length <= 11 ||
          "Eine Steueridentifikationsnummer besteht aus 11 Ziffern.",
      },
    };
  },
  created() {
    const token = localStorage.getItem("token");
    const TokenPayload = VueJwtDecode.decode(token);
    this.consultant_id = TokenPayload.user_information[0].consultant_id;
  },
  methods: {
    NewAddCustomer() {
      if (this.$refs.form.validate()) {
      let addNewOneCustomer = {
        consultant_id: this.consultant_id,
        firstname: this.addNewCustomer.firstname,
        lastname: this.addNewCustomer.lastname,
        street: this.addNewCustomer.street,
        zip_code: this.addNewCustomer.zip_code,
        city: this.addNewCustomer.city,
        tax_id: this.addNewCustomer.tax_id,
        email: this.addNewCustomer.email,
        birthday_date: this.date,
        country: this.selectedCountry,
        nationality: this.selectedNationality,
        family_status: this.selectedFamily_status
      };
      axios
        .post("http://localhost:8000/customer/addCustomer", addNewOneCustomer)
        .then(response => {
          console.log(response);
          bus.$emit('items-updated');
        })
        .catch(error => {
          console.log(error);
        });
        this.addCustomer = false;
    }
    }
  }
};
</script>