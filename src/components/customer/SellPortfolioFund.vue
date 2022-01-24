<template>
  <v-dialog v-model="sellPortfolioFund" class="mb-1" persistent>
    <template v-slot:activator="{ on }">
      <v-btn elevation="0" dark color="red" small v-on="on">
        <v-icon left small>mdi-minus</v-icon>Verkaufen
      </v-btn>
    </template>
    <v-stepper v-model="nextStep">
      <v-stepper-header>
        <v-stepper-step :complete="nextStep > 1" step="1" color="#243B55">Fondsauswahl</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="nextStep > 2" step="2" color="#243B55">Verkaufen</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-2" color="#243B55" dark>
            <v-card-title>Wählen Sie einen Fonds aus</v-card-title>
            <v-card-subtitle>Anschließend können Sie angeben wie viel Stück sie hiervon verkaufen möchten.</v-card-subtitle>
            <v-card-text>
              <v-simple-table light>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">ISIN</th>
                      <th class="text-left">Name</th>
                      <th class="text-left">Stückzahl</th>
                      <th class="text-left">Marktpreis</th>
                      <th class="text-left mr-2">Kaufpreis</th>
                      <th class="text-left mr-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(items,index) in portfolioId.funds" :key="index">
                      <td>{{items.isin}}</td>
                      <td class="font-weight-bold">{{items.fund_name}}</td>
                      <td>{{items.quantity}}</td>
                      <td>{{items.marketprice}} €</td>
                      <td>{{items.buying_price}} €</td>
                      <td>
                        <v-btn
                          rounded
                          small
                          depressed
                          color="green"
                          dark
                          v-model="getSelectedFund"
                          @click="getSelect(items)"
                        >
                          <v-icon small left>mdi-check</v-icon>Weiter
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
          <v-btn depressed small @click="onCloseDialog()">Abbrechen</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card flat>
            <v-card-text>
              <div class="d-flex">
                <v-card width="100%" class="pa-4" flat color="#243B55" dark>
                  <v-card-text>
                    <v-list-item class="text-center" color="red">
                      <v-list-item-content>
                        <v-list-item-subtitle>Fondsname</v-list-item-subtitle>
                        <v-list-item-title class="display-1">
                          {{this.getSelectedFund.fund_name}}
                          <v-icon large class="mb-2" right>mdi-chart-line</v-icon>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-card color="white" light class="text-center">
                      <v-list-item class="mt-4">
                        <v-list-item-content>
                          <v-list-item-subtitle>Aktueller Marktpreis</v-list-item-subtitle>
                          <v-list-item-title>{{this.getSelectedFund.marketprice}} €</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                          <v-list-item-subtitle>Kaufpreis</v-list-item-subtitle>
                          <v-list-item-title>{{this.getSelectedFund.buying_price}} €</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-content>
                          <v-list-item-subtitle>Differenz</v-list-item-subtitle>
                          <v-list-item-title>{{formatPrice(this.getSelectedFund.marketprice - this.getSelectedFund.buying_price)}} €</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="mt-4">
                        <v-list-item-content>
                          <v-list-item-subtitle>Der Kunde besitzt</v-list-item-subtitle>
                          <v-list-item-title class="mt-2">
                            <v-chip color="#243B55" dark>{{this.getSelectedFund.quantity}} Stück</v-chip>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-card-text>
                </v-card>
                <v-card width="100%" class="pa-4 text-center" flat>
                  <v-card-title
                    class="myheadline headline justify-center mt-5"
                  >Wie viel Stück sollen verkauft werden?</v-card-title>
                  <v-col cols="6" sm="6" class="ml-auto mr-auto">
                    <v-text-field filled label="Stückzahl" v-model="invest" v-mask="'####'" type="text"></v-text-field>
                                      <div class="error">{{error}}</div>
                  </v-col>
                  <div class="text-center">
                    Der Kunde erhält:
                    <b>{{formatPrice(calculatedSellFund)}} €</b>
                    <br />Neue Stückzahl:
                    <b>{{newQuantity}}</b>
                  </div>
                  <v-btn class="mt-4" depressed color="#243B55" dark @click="sellFund()">Verkaufen</v-btn>
                </v-card>
              </div>
            </v-card-text>
            <v-btn depressed small @click="nextStep = 1">Zurück</v-btn>
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
  props: {
    portfolioId: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      nextStep: 1,
      sellPortfolioFund: false,
      invest: null,
      error: null,
      editedItem: null,
      getSelectedFund: [
        {
          fund_id: null,
          fund_name: null,
          marketprice: null,
          buying_price: null,
          quantity: null
        }
      ]
    };
  },
  created() {
    bus.$on("sellFundForCustomer", editData => {
      this.editedItem = editData;
    });
  },
  mounted() {},
  computed: {
    calculatedSellFund: function() {
      if (this.invest <= this.getSelectedFund.quantity) {
        var calculated = (
          this.invest * this.getSelectedFund.marketprice
        ).toFixed(2);
        return calculated;
      } else {
        return (calculated = 0);
      }
    },
    newQuantity: function() {
      var calculated_new_quantity = this.getSelectedFund.quantity - this.invest;
      return calculated_new_quantity;
    }
  },
  methods: {
    getSelect(items) {
      this.nextStep = 2;
      this.getSelectedFund.fund_id = items.fund_id;
      this.getSelectedFund.quantity = items.quantity;
      this.getSelectedFund.fund_name = items.fund_name;
      this.getSelectedFund.buying_price = items.buying_price;
      this.getSelectedFund.marketprice = items.marketprice;
    },
    sellFund() {
      if (this.invest <= this.getSelectedFund.quantity) {
        var gotID = this.portfolioId.portfolio_id;
        let SellFundFromPortfolio = {
          portfolio_id: gotID,
          fund_id: this.getSelectedFund.fund_id,
          quantity: this.invest
        };
        axios
          .post(
            "http://localhost:8000/customer/sellFund",
            SellFundFromPortfolio
          )
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
        this.sellPortfolioFund = false;
        this.nextStep = 1;
        this.invest = null;
        this.error = null;
        bus.$emit("portfolio-updated");
        } else {
          this.error= "Bitte geben Sie einen gültigen Wert ein."
        }
    },
    onCloseDialog() {
      this.sellPortfolioFund = false;
      this.invest = null;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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