<template>
  <v-dialog v-model="addPortfolioFund" class="mb-1" persistent>
    <template v-slot:activator="{ on }">
      <v-btn
        elevation="0"
        dark
        color="green"
        small
        class="mr-4"
        v-on="on"
      >
        <v-icon left small>mdi-plus</v-icon>Kaufen
      </v-btn>
    </template>
    <v-stepper v-model="actualStep">
      <v-stepper-header>
        <v-stepper-step :complete="actualStep > 1" step="1" color="#243B55">Fondsauswahl</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="actualStep > 2" step="2" color="#243B55">Stückzahl</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" color="#243B55">Kaufbestätigung</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <!------------------------------------------------>
        <v-stepper-content step="1">
          <v-card height="450">
            <v-data-table
              :search="search"
              :headers="headers"
              :items="content"
              :items-per-page="5"
              flat
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title class="subtitle font-weight-bold">Wählen Sie einen Fonds aus:</v-toolbar-title>
                  <v-spacer />
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Suchen"
                    hide-details
                    outlined
                    dense
                  ></v-text-field>
                </v-toolbar>
              </template>
              <template v-slot:item.fund_id="{ item }">
                <v-chip small color="#F1F3F4">{{ item.fund_id }}</v-chip>
              </template>
              <template v-slot:item.isin="{ item }">
                <v-chip small color="#243B55" dark>{{ item.isin }}</v-chip>
              </template>
              <template v-slot:item.marketprice="{ item }">{{ item.marketprice }}€</template>
              <template v-slot:item.action="{ item }">
                <v-btn
                  rounded
                  small
                  depressed
                  v-model="getSelectedFund"
                  @click="getSelect(item)"
                  color="green"
                  dark
                >
                  <v-icon small left>mdi-check</v-icon>Weiter
                </v-btn>
              </template>
            </v-data-table>
            <v-btn depressed small @click="addPortfolioFund = false">Abbrechen</v-btn>
          </v-card>
        </v-stepper-content>
        <!------------------------------------------------>
        <v-stepper-content step="2">
          <v-card class="mb-2" flat row-wrap>
            <div class="d-flex">
              <v-card color="#243B55" dark flat class="pa-4" width="100%" height="100%">
                <v-card-title class="myheadline headline justify-center mt-5">Stückzahlrechner</v-card-title>
                <v-card-text class="myCardText text-center">
                  <div color="mb-5">
                    Der aktuelle Tageskurs beträgt:
                    <div
                      class="actualPrice headline font-weight-bold mb-6"
                    >{{getSelectedFund.marketprice}} €</div>
                  </div>Bitte geben Sie das Investmentkapital des Kundens ein:
                  <v-row>
                    <v-col cols="6" sm="6" class="ml-auto mr-auto mt-4">
                      <v-text-field filled label="Investmentkapital" v-model="invest"></v-text-field>
                    </v-col>
                  </v-row>
                  <div class="mt-3">
                    Errechnete maximale Stückzahl:
                    <br />
                    <div class="actualPrice mt-2 mb-5 headline font-weight-bold">
                      <v-btn large color="#FAFBFC" light>{{calculatedQuantity}} Stück</v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card flat class="pa-4" width="100%">
                <v-card-title class="myheadline headline justify-center mt-5">Stückzahl kaufen</v-card-title>
                <v-card-text class="myCardText text-center">
                  <b>Fondsname:</b>
                  {{getSelectedFund.fund_name}}
                  <br />
                  <b>ISIN:</b>
                  {{getSelectedFund.isin}}
                  <br />
                  <b>Marktpreis:</b>
                  {{getSelectedFund.marketprice}} €
                  <br />
                  <b>Lowest Invest:</b>
                  {{getSelectedFund.lowest_invest}} €
                  <br />
                  <v-row>
                    <v-col cols="6" sm="6" class="mt-7 ml-auto mr-auto mb-0">
                      <v-text-field filled value="0€" label="Stückzahl" v-model="quantity" v-mask="'####'" type="text">
                        <div class="error">{{error}}</div>
                      </v-text-field>
                      <div class="error">{{error}}</div>
                    </v-col>
                  </v-row>
                  <div class="font-weight-bold subtitle-1">Kosten: {{formatPrice(investCosts)}} €</div>
                  <div class>
                    Mit einem Klick auf weiter kommen Sie zur Kaufbestätigung
                    <br />

                    <div class="actualPrice mt-2 mb-5">
                      <v-btn
                        dark
                        color="#243B55"
                        depressed
                        @click="checkQuantity(investCosts)"
                      >Weiter</v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-card>
          <v-btn depressed small @click="goBack()">Zurück</v-btn>
        </v-stepper-content>
        <!------------------------------------------------>
        <v-stepper-content step="3">
          <v-card flat>
            <v-card color="#243B55" dark class="pa-4 ml-auto mr-auto" width="850">
              <v-card-title class="justify-center">
                <v-icon left>mdi-bank</v-icon>Transaktionsübersicht
              </v-card-title>
              <v-card-subtitle
                class="text-center"
              >Bitte bestätigen Sie ihre Angaben mit einem Klick auf "Kauf bestätigen"</v-card-subtitle>
              <v-card-text>
                <v-card color="#FAFBFC" class="text-center" light>
                  <v-list-item class="mt-4">
                    <v-list-item-content>
                      <v-list-item-subtitle>Fondsname</v-list-item-subtitle>
                      <v-list-item-title>{{this.getSelectedFund.fund_name}}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-content>
                      <v-list-item-subtitle>Stückzahl</v-list-item-subtitle>
                      <v-list-item-title>{{this.quantity}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mb" />
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Investmentsumme</v-list-item-subtitle>
                      <v-list-item-title>{{formatPrice(finalInvestCosts)}}€</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-subtitle></v-list-item-subtitle>
                      <v-list-item-title>-</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-subtitle>Ausgabeaufschlag</v-list-item-subtitle>
                      <v-list-item-title>{{formatPrice(Ausgabeaufschlag)}}€</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-subtitle></v-list-item-subtitle>
                      <v-list-item-title>=</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-subtitle>Positionswert</v-list-item-subtitle>
                      <v-list-item-title>{{formatPrice(finalInvestCosts - Ausgabeaufschlag)}}€</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <v-btn
                  small
                  class="mt-4"
                  depressed
                  color="green"
                  width="100%"
                  @click="buyFund()"
                >Kauf bestätigen</v-btn>
              </v-card-text>
            </v-card>
          </v-card>
          <v-btn depressed small @click="actualStep = 2">Zurück</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
import { bus } from "../../main";
import axios from "axios";

export default {
  props: {
    portfolioId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      actualStep: 1,
      content: [],
      addPortfolioFund: false,
      selectedPortfolio: null,
      invest: null,
      editedItem: {},
      calculated: 0,
      quantity: null,
      error: null,
      getSelectedFund: [
        {
          fund_id: null,
          isin: null,
          fund_name: null,
          marketprice: null,
          lowest_invest: null,
          subscription_fee: null,
          wkn: null
        }
      ],
      dialogNote: {},
      search: "",
      headers: [
        { text: "Fonds-ID", value: "fund_id", sortable: false },
        { text: "ISIN", value: "isin" },
        { text: "Fondsname", value: "fund_name" },
        { text: "WKN", value: "wkn" },
        { text: "Marktpreis", value: "marketprice" },
        { text: "Kategorie", value: "fund_cat_text" },
        { text: "Aktion", value: "action", sortable: false }
      ]
    };
  },
  mounted() {
    this.initialize();
  },
  computed: {
    calculatedQuantity: function() {
      var calculated = Math.floor(
        this.invest / this.getSelectedFund.marketprice
      );
      return calculated;
    },
    investCosts: function() {
      var costs = Math.floor(this.quantity) * this.getSelectedFund.marketprice;
      return costs;
    },
    finalInvestCosts: function() {
      var finalcosts = this.quantity * this.getSelectedFund.marketprice;
      return finalcosts;
    },
    Ausgabeaufschlag: function() {
      var finalcosts2 = (this.quantity * this.getSelectedFund.marketprice) * this.getSelectedFund.subscription_fee;
      return finalcosts2;
    },
  },
  methods: {
    getSelect(item) {
      this.actualStep = 2;
      this.getSelectedFund.fund_id = item.fund_id;
      this.getSelectedFund.marketprice = item.marketprice;
      this.getSelectedFund.lowest_invest = item.lowest_invest;
      this.getSelectedFund.fund_name = item.fund_name;
      this.getSelectedFund.isin = item.isin;
    },
    initialize() {
      axios
        .get("http://localhost:8000/fund")
        .then(response => {
          this.content = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    checkQuantity() {
      if (
        this.quantity * this.getSelectedFund.marketprice <
        this.getSelectedFund.lowest_invest
      ) {
        return (this.error =
          "Sie müssten mindestens " +
          this.getSelectedFund.lowest_invest +
          "€ investieren.");
      } else {
        this.actualStep = 3;
        this.error = null;
      }
    },
    goBack() {
      this.actualStep = this.actualStep - 1;
      this.error = null;
    },
    buyFund() {
      let addFundToPortfolio = {
        portfolio_id: this.portfolioId,
        fund_id: this.getSelectedFund.fund_id,
        quantity: this.quantity,
        buying_price: this.getSelectedFund.marketprice
      };
      axios
        .post("http://localhost:8000/customer/addFund", addFundToPortfolio)
        .then(response => {
          console.log(response);
          bus.$emit("portfolio-updated");
        })
        .catch(error => {
          if (error.response.status === 401) {
            alert("Sie können pro Depot in maximal 3 Fonds investieren.");
          }
        });
      this.addPortfolioFund = false;
      this.actualStep = 1;
      this.selectedPortfolio = null;
      this.getSelectedFund.fund_id = null;
      this.quantity = null;
      this.getSelectedFund.marketprice = null;
    }
  }
};
</script>

<style>
.theme--light.v-table tbody tr:not(:last-child) {
  border-bottom: none;
}

.myheadline {
  padding: 0 0 20px 0;
}

.smallFont {
  font-size: 12px;
}

.myCardText {
  padding: 0;
}

.actualPrice {
  color: white;
}

.error {
  font-size: 12px;
  color: white;
  margin-top: -25px;
}
</style>