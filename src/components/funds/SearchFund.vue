<template>
  <v-dialog v-model="showFundSearch" class="mb-1" persistent>
    <template v-slot:activator="{ on }">
      <v-btn small depressed color="#243B55" dark v-on="on" class="mr-2">Fondssuche</v-btn>
    </template>
    <v-stepper v-model="nextStep">
      <v-stepper-header>
        <v-stepper-step :complete="nextStep > 1" step="1" color="#243B55">Anlagesumme</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="nextStep > 2" step="2" color="#243B55">Fondskategorie</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="nextStep > 3" step="3" color="#243B55">Risikoklasse</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card tile class="mb-2 text-center" color="#243B55" dark>
            <v-card-title class="justify-center">Geben Sie die Anlagesumme des Kunden ein:</v-card-title>
            <v-card-subtitle>In den Fondsvorschlägen können Sie nach Kriterien den passenden Fonds für einen Kunden ermitteln.</v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col cols="6" sm="6" class="ml-auto mr-auto">
                  <v-text-field
                    filled
                    value="0€"
                    label="Anlagesumme eingeben"
                    v-model="investSum"
                    v-mask="'########'" type="text"
                  ></v-text-field>
                  <div class="error">{{error}}</div>
                </v-col>
              </v-row>
              <v-btn light @click="checkInvest()">weiter</v-btn>
            </v-card-text>
          </v-card>
          <v-btn depressed small @click="closeDialog()">Abbrechen</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card flat>
            <v-card color="#243B55" class="mb-2" dark flat>
              <v-card-title
                class="justify-center"
              >In welche Fondskategorie möchten der Kunde investieren?</v-card-title>
              <v-card-subtitle
                class="text-center"
              >Bitte wählen Sie aus in welche Fondeskategorie der Kunde investieren möchte.</v-card-subtitle>
              <v-card-text class="text-center">
                <v-col cols="12" sm="6" md="6" class="ml-auto mr-auto">
                  <v-form ref="form2">
                  <v-select
                    :items="fund_categorys"
                    dense
                    placeholder=" "
                    v-model="selected_fund_categorys"
                    filled
                    label="Fondskategorie"
                    :rules="[rules.required]"
                  ></v-select>
                  </v-form>
                </v-col>
                <v-btn light @click="checkContent()">Weiter</v-btn>
              </v-card-text>
            </v-card>
            <v-btn depressed small @click="nextStep = 1">Zurück</v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card flat>
            <v-card color="#243B55" dark flat class="mb-2">
              <v-card-title class="justify-center">Welcher Risikoklasse soll der Fonds entsprechen?</v-card-title>
              <v-card-text class="text-center">
                <v-col cols="12" sm="6" md="6" class="ml-auto mr-auto">
                  <v-form ref="form">
                  <v-select
                    :items="risk_classes"
                    dense
                    placeholder=" "
                    v-model="selected_risk_classes"
                    filled
                    label="Risikoklasse"
                    :rules="[rules.required]"
                  ></v-select>
                  </v-form>
                </v-col>

                <v-dialog v-model="showSearchResults" fullscreen>
                  <v-toolbar class="gradient pl-4 font-weight-light" height="60px" flat dark>
                    <v-icon left>mdi-search</v-icon>Fondssuche - Vorschläge
                    <v-spacer />
                    <v-btn x-small text depressed @click="closeResults()">
                      <v-icon left>mdi-menu-down</v-icon>Weniger anzeigen
                    </v-btn>
                  </v-toolbar>
                  <template v-slot:activator="{ on }">
                    <v-btn light @click="searchForFunds()" v-on="on">Vorschläge anzeigen</v-btn>
                  </template>
                  <v-card class="text-center">
                    <v-card-title
                      class="justify-center"
                    >Hier sehen sie alle Fonds für die folgenden Angaben:</v-card-title>
                    <v-card-text>
                      <div>
                        Fondskategorie:
                        <b>{{selected_fund_categorys}}</b>
                      </div>
                      <div>
                        Risikoklasse:
                        <b>{{selected_risk_classes}}</b>
                      </div>
                      <div>
                        Anlagesumme:
                        <b>{{formatPrice(investSum)}}</b>
                      </div>
                      <br />
                      <template v-if="!results.length">
                        <div
                          class="error text-center mt-2 mb-2 ml-auto mr-auto"
                        >Zu ihren Suchoptionen gibt es keinen passenden Fonds.</div>
                      </template>
                      <template v-else>
                        <v-card
                          v-for="(result,index) in results"
                          :key="index"
                          class="text-center mb-5 ml-auto mr-auto"
                          width="750"
                          elevation="2"
                        >
                          <v-toolbar class="subtitle" color="#243B55" height="60px" flat dark>
                            <v-icon small left>mdi-bank</v-icon>
                            {{result.fund_name}}
                            <v-spacer />
                            {{result.fund_cat_text}}
                          </v-toolbar>
                          <v-card-text>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-subtitle>ISIN</v-list-item-subtitle>
                                <v-list-item-title>{{result.isin}}</v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-content>
                                <v-list-item-subtitle>WKN</v-list-item-subtitle>
                                <v-list-item-title>{{result.wkn}}</v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-content>
                                <v-list-item-subtitle>Lowest Invest</v-list-item-subtitle>
                                <v-list-item-title>{{formatPrice(result.lowest_invest)}}</v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-content>
                                <v-list-item-subtitle>Risikoklasse</v-list-item-subtitle>
                                <v-list-item-title>{{result.risk_class_text}}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
            <v-btn depressed small @click="nextStep = 2">Zurück</v-btn>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
import { bus } from "../../main";
import axios from "axios";

export default {
  data() {
    return {
      nextStep: 1,
      showFundSearch: false,
      selected_risk_classes: null,
      selected_fund_categorys: null,
      investSum: null,
      error: null,
      showSearchResults: null,
      results: {},
      fund_categorys: [
        "Aktienfonds",
        "Rentenfonds",
        "Geldmarktfonds",
        "Mischfonds",
        "Immobilienfonds"
      ],
      risk_classes: [
        "gewinnorientiert",
        "konservativ",
        "spekulativ",
        "sicherheitsorientiert"
      ],      
      rules: {
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben.",
      },
    };
  },
  created() {
    bus.$on("ShowFundSearch", data1 => {
      this.showFundSearch = data1;
    });
  },
  methods: {
        checkInvest() {
      if (this.investSum < 25) {
        this.error = "Die Mindestanlagesumme muss 25,00€ betragen"
      } else {
        this.nextStep = 2
      }
    },
    checkContent() {
      if (this.$refs.form2.validate()) {
        this.nextStep = 3;
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    closeDialog() {
      this.showFundSearch = false;
      this.nextStep = 1;
      this.selected_risk_classes = null;
      this.selected_fund_categorys = null;
      this.investSum = null;
    },
    closeResults() {
      this.showFundSearch = false;
      this.showSearchResults = false;
      this.nextStep = 1;
    },
    searchForFunds() {
      if (this.$refs.form.validate()) {
      let SearchFundOptions = {
        lowest_invest: this.investSum,
        fund_category: this.selected_fund_categorys,
        risk_class: this.selected_risk_classes
      };
      axios
        .post("http://localhost:8000/customer/filterFund", SearchFundOptions)
        .then(response => {
          this.results = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
  }
};
</script>

<style>
.theme--light.v-table tbody tr:not(:last-child) {
  border-bottom: none;
}

.my-text {
  font-size: 20px;
  color: white;
  font-weight: bold;
}

.error {
  font-size: 12px;
  color: white;
  margin-top: -30px;
}
</style>