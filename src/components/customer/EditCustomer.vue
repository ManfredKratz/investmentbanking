<template>
  <v-dialog v-model="editCustomer">
    <v-sheet>
      <v-toolbar class="gradient" height="3px" flat></v-toolbar>
      <v-card-title class="subtitle pl-4 mb-3">
        <v-icon left>mdi-account</v-icon>Kunde bearbeiten
        <v-spacer />
        <v-btn class="mr-5" depressed dark small color="#1E3047" @click="editSelectedCustomer()">
          <v-icon small left>mdi-check</v-icon>Speichern
        </v-btn>
        <v-btn small color="#F3F3F3" depressed @click="editCustomer = !editCustomer">
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
              v-model="editedItem.firstname"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Nachname"
              v-model="editedItem.lastname"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="E-Mail" v-model="editedItem.email" filled placeholder=" " :rules="[rules.email]"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <div></div>
          </v-col>
        </v-row>
        <div class="overline font-weight-bold mb-1">Herkunft</div>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="countrys"
              dense
              v-model="editedItem.country_name"
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
              v-model="editedItem.zip_code"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="Ort" filled v-model="editedItem.city" placeholder=" " :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Straße + Hausnummer"
              v-model="editedItem.street"
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
              v-model="editedItem.nationality_text"
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
              v-model="editedItem.family_status_text"
              placeholder=" "
              filled
              label="Familienstand"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
        </v-row>
        </v-form>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script>
import { bus } from "../../main";
import axios from 'axios';

export default {
  data() {
    return {
      editCustomer: false,
      editedItem: {},
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
            editedCustomer: [
        {
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
        }
      },
    };
  },
  created() {
    bus.$on("editCustomer", data => {
      this.editCustomer = data;
    });
    bus.$on("EditData", editData => {
      this.editedItem = editData;
    });
  },
  methods: {
    editSelectedCustomer() {
      if (this.$refs.form.validate()) {
      let editExistingCustomer = {
        consultant_id: 1,
        firstname: this.editedItem.firstname,
        lastname: this.editedItem.lastname,
        street: this.editedItem.street,
        zip_code: this.editedItem.zip_code,
        city: this.editedItem.city,
        tax_id: this.editedItem.tax_id,
        email: this.editedItem.email,
        birthday_date: this.editedItem.birthday_date,
        country: this.editedItem.country_name,
        nationality: this.editedItem.nationality_text,
        family_status: this.editedItem.family_status_text,
        customer_id: this.editedItem.customer_id
      };
      axios
        .put(
          "http://localhost:8000/customer/edit",
          editExistingCustomer
        )
        .then(response => {
          console.log(response);
          bus.$emit('items-updated');
        })
        .catch(error => {
          console.log(error);
          console.log(editExistingCustomer);
        });
        this.editCustomer = false;
    }
    }
  }
};
</script>