<template>
  <v-dialog v-model="editFund">
    <v-sheet>
      <v-toolbar class="gradient" height="3px" flat></v-toolbar>
      <v-card-title class="subtitle pl-4 mb-3">
        <v-icon left>mdi-account</v-icon>Fonds bearbeiten
        <v-spacer />
        <v-btn class="mr-5" depressed dark small color="#1E3047" @click="editThisFund()">
          <v-icon small left>mdi-check</v-icon>Speichern
        </v-btn>
        <v-btn small color="#F3F3F3" depressed @click="editFund = !editFund">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </v-card-title>
      <div class="pl-5 pr-5 pt-1">
        <v-form ref="form">
        <div class="overline font-weight-bold mb-1">Angaben zum Fonds</div>
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="fund_categorys"
              v-model="editedFund.fund_cat_text"
              placeholder=" "
              filled
              dense
              label="Kategorie"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Fondsname"
              v-model="editedFund.fund_name"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3"></v-col>
          <v-col cols="12" sm="6" md="3"></v-col>
        </v-row>
        <div class="overline font-weight-bold mb-1">Weitere Angaben</div>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Marktpreis"
              filled
              v-model="editedFund.marketprice"
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Mindestanlagesumme"
              v-model="editedFund.lowest_invest"
              filled
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              label="Ausgabeaufschlag"
              filled
              v-model="editedFund.subscription_fee"
              placeholder=" "
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              :items="risk_classes"
              dense
              placeholder=" "
              v-model="editedFund.risk_class_text"
              filled
              label="Risikoklasse"
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
      editFund: false,
      editedFund: {},
      fund_categorys: ["Aktienfonds", "Rentenfonds", "Geldmarktfonds", "Mischfonds", "Immobilienfonds"],
      risk_classes: ["gewinnorientiert", "konservativ", "spekulativ", "sicherheitsorientiert"],
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
  created() {
    bus.$on("editFund", showEdit => {
      this.editFund = showEdit;
    });
    bus.$on("EditFund", editSelectedFund => {
      this.editedFund = editSelectedFund;
    });
  },
  methods: {
    editThisFund() {
      if (this.$refs.form.validate()) {
      let editExistingFund = {
        fund_id: this.editedFund.fund_id,
        isin: this.editedFund.isin,
        wkn: this.editedFund.wkn,
        fund_name: this.editedFund.fund_name,
        fund_cat: this.editedFund.fund_cat_text,
        marketprice: this.editedFund.marketprice,
        lowest_invest: this.editedFund.lowest_invest,
        subscription_fee: this.editedFund.subscription_fee,
        risk_class: this.editedFund.risk_class_text,
      };
      axios
        .put(
          "http://localhost:8000/fund/edit",
          editExistingFund
        )
        .then(response => {
          console.log(response);
          bus.$emit('funds-updated');
        })
        .catch(error => {
          console.log(error);
        });
        this.editFund = false;
    }
    }
  }
};
</script>