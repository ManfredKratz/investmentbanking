<template>
  <v-dialog v-model="addFund" scrollable>
    <template v-slot:activator="{ on }">
      <v-btn text color="#243B55" dark v-on="on" class="ml-2">
        <v-icon>mdi-bank-plus</v-icon>
      </v-btn>
    </template>
    <v-sheet>
      <v-toolbar class="gradient" height="3px" flat></v-toolbar>
      <v-card-title class="subtitle pl-4 mb-3">
        <v-icon left>mdi-account</v-icon>Neuen Fonds anlegen
        <v-spacer />
        <v-btn class="mr-5" depressed dark small color="#1E3047" @click="addNewOneFund()">
          <v-icon small left>mdi-check</v-icon>Speichern
        </v-btn>
        <v-btn small color="#F3F3F3" depressed @click="addFund = !addFund">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-card-title>
      <div class="pl-5 pr-5 pt-1">
        <v-form ref="form">
        <div class="overline font-weight-bold mb-1">Angaben zum Fonds</div>
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-select :items="fund_categorys" v-model="selected_fund_categorys" placeholder=" " :rules="[rules.required]" filled dense label="Kategorie"></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="Fondsname" v-model="addNewFund.fund_name" :rules="[rules.required]" filled placeholder=" "></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="ISIN" v-model="addNewFund.isin" :rules="[rules.required]" filled placeholder=" "></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="WKN" v-model="addNewFund.wkn" :rules="[rules.required]" filled placeholder=" "></v-text-field>
          </v-col>
        </v-row>
        <div class="overline font-weight-bold mb-1">Weitere Angaben</div>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="Marktpreis" v-model="addNewFund.marketprice" :rules="[rules.required]" filled placeholder=" "></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="Mindestanlagesumme" v-model="addNewFund.lowest_invest" :rules="[rules.required]" filled placeholder=" "></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field dense label="Ausgabeaufschlag" v-model="addNewFund.subscription_fee" :rules="[rules.required]" filled placeholder=" "></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select :items="risk_classes" dense placeholder=" " v-model="selected_risk_classes" :rules="[rules.required]" filled label="Risikoklasse"></v-select>
          </v-col>
        </v-row>
        </v-form>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import { bus } from "../../main";

export default {
  data() {
    return {
      addFund: false,
      fund_categorys: ["Aktienfonds", "Rentenfonds", "Geldmarktfonds", "Mischfonds", "Immobilienfonds"],
      risk_classes: ["gewinnorientiert", "konservativ", "spekulativ", "sicherheitsorientiert"],
      selected_fund_categorys: null,
      selected_risk_classes: null,
      addNewFund: [
        {
        fund_id: null,
        isin: null,
        wkn: null,
        fund_name: null,
        fund_cat_text: null,
        marketprice: null,
        lowest_invest: null,
        subscription_fee: null,
        risk_class_text: null,
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
  methods: {
    addNewOneFund() {
      if (this.$refs.form.validate()) {
      let addNewOneFund = {
        isin: this.addNewFund.isin,
        wkn: this.addNewFund.wkn,
        fund_name: this.addNewFund.fund_name,
        fund_cat_text: this.selected_fund_categorys,
        marketprice: this.addNewFund.marketprice,
        lowest_invest: this.addNewFund.lowest_invest,
        subscription_fee: this.addNewFund.subscription_fee,
        risk_class_text: this.selected_risk_classes,
      };
      axios
        .post("http://localhost:8000/fund/create", addNewOneFund)
        .then(response => {
          console.log(response);
          bus.$emit('funds-updated');
        })
        .catch(error => {
          console.log(error);
        });
      this.addFund = false
    }
    }
  }
};
</script>