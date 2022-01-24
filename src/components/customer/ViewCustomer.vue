<template>
  <v-dialog v-model="viewCustomer" fullscreen>
    <v-card tile color="#FEFEFE">
      <v-toolbar class="gradient pl-4 font-weight-light" height="60px" flat dark>
        <v-icon left>mdi-bank</v-icon>Depotverwaltung
        <v-spacer />
        <v-btn x-small text depressed @click="closeThatView()">
          <v-icon left>mdi-menu-down</v-icon>Weniger anzeigen
        </v-btn>
      </v-toolbar>
      <v-layout class="pa-3">
        <v-flex xs2 sm2 md-2>
          <v-card tile flat class>
            <v-card-title>
              <v-icon left>mdi-account-circle</v-icon>
              {{editedItem.firstname}} {{editedItem.lastname}}
            </v-card-title>
            <v-card-subtitle>
              {{editedItem.email}}
              <br />
              {{editedItem.zip_code}} {{editedItem.city}}, {{editedItem.street}}
              <br />
              {{editedItem.country_name}}
              <br />
            </v-card-subtitle>
            <v-card-text>
              <v-chip dark small class="mr-3">
                <v-icon small left>mdi-earth</v-icon>
                {{editedItem.nationality_text}}
              </v-chip>
              <v-chip dark small class="mr-3">
                <v-icon small left>mdi-home-heart</v-icon>
                {{editedItem.family_status_text}}
              </v-chip>
            </v-card-text>
            <v-dialog v-model="ConfirmAddPortfolio" width="450">
              <template v-slot:activator="{ on }">
                <v-btn depressed v-on="on" small class="ml-4">
                  <v-icon left small>mdi-plus</v-icon>Depot hinzufügen
                </v-btn>
              </template>
              <v-card class="text-center">
                <v-card-title class="justify-center">Möchten Sie ein Depot eröffnen?</v-card-title>
                <v-card-text>
                  Depot anlegen für Kunde
                  <br />
                  <b>{{editedItem.firstname}} {{editedItem.lastname}}</b>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="#243B55"
                    small
                    class="mr-2"
                    text
                    @click="ConfirmAddPortfolio = false"
                  >Abbrechen</v-btn>
                  <v-btn color="#243B55" small depressed dark @click="addPortfolio()">Eröffnen</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card>
        </v-flex>
        <v-flex xs8 sm8 md-8>
          <div class="pl-12">
            <template v-if="!portfolios.length">
              <v-card-text class="pl-8 mt-2 text-center">
                <v-icon left>mdi-alert</v-icon>Der Kunde besitzt kein angelegtes Depot.
              </v-card-text>
            </template>
            <template v-else>
              <div class="justify-center">
                <v-card-text v-for="(item, index) in portfolios" :key="index">
                  <v-card
                    dark
                    color="gradient"
                    elevation="4"
                    class="pa-2 ml-auto mr-auto justify-center"
                    max-width="1000px"
                  >
                    <v-list-item three-line>
                      <v-list-item-content color="red">
                        <div class="overline mb-2">
                          <v-chip color="white" light x-small>Depot-Nr: {{item.portfolio_id}}</v-chip>
                        </div>
                        <v-list-item-title
                          class="display-1 mb-1"
                        >{{formatPrice(item.portfolio_value)}}€</v-list-item-title>
                        <v-list-item-subtitle>
                          Einstandwert: {{formatPrice(item.investment_capital)}}€
                          <br />
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-avatar size="80" color="#fff">
                        <v-icon color="#243B55" large>mdi-bank</v-icon>
                      </v-list-item-avatar>
                    </v-list-item>
                    <template v-if="!item.funds.length"></template>
                    <template v-else>
                      <v-simple-table class="ml-4 mr-4" light>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">ISIN</th>
                              <th class="text-left">Name</th>
                              <th class="text-left">Stückzahl</th>
                              <th class="text-left">Marktpreis</th>
                              <th class="text-left">Positionswert</th>
                              <th class="text-left mr-2">Kaufpreis</th>
                              <th class="text-left">Performance</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(items,index) in item.funds" :key="index">
                              <td>{{items.isin}}</td>
                              <td class="font-weight-bold">{{items.fund_name}}</td>
                              <td>{{items.quantity}}</td>
                              <td>{{formatPrice(items.marketprice)}} €</td>
                              <td>{{formatPrice(items.positionswert)}} €</td>
                              <td>{{formatPrice(items.buying_price)}} €</td>
                              <td>{{items.performance}} %</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <v-list-item-action>
                      <v-layout row class="ml-auto">
                        <AddPortfolioFundComponent :portfolioId="item.portfolio_id"></AddPortfolioFundComponent>
                        <template v-if="!item.funds.length"></template>
                        <template v-else>
                          <SellPortfolioFundComponent :portfolioId="item"></SellPortfolioFundComponent>
                        </template>
                      </v-layout>
                    </v-list-item-action>
                  </v-card>
                </v-card-text>
              </div>
            </template>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "../../main";
import axios from "axios";
import AddPortfolioFundComponent from "./AddPortfolioFund.vue";
import SellPortfolioFundComponent from "./SellPortfolioFund.vue";

export default {
  components: {
    AddPortfolioFundComponent,
    SellPortfolioFundComponent
  },
  data() {
    return {
      viewCustomer: false,
      editedItem: {},
      portfolios: [],
      userdata: {},
      ConfirmAddPortfolio: false,
      selectedPortfolio: null,
      customerID: null,
      dialogNote: {},
      selectedPortfolio2: {}
    };
  },
  mounted() {
    bus.$on("PortfolioData", userData => {
      this.portfolios = userData;
    });
  },
  methods: {
    closeView() {
      (this.viewCustomer = false), (this.portfolios = {});
    },
    addPortfolio() {
      let CustomerInformation = {
        customer_id: this.editedItem.customer_id
      };
      axios
        .post(
          "http://localhost:8000/customer/addPortfolio",
          CustomerInformation
        )
        .then()
        .catch(error => {
          console.log(error);
        });
      this.ConfirmAddPortfolio = false;
      bus.$emit("portfolio-updated");
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    closeThatView() {
      this.viewCustomer = false;
      this.editedItem = {};
    }
  },
  created() {
    bus.$on("viewCustomer", data => {
      this.viewCustomer = data;
    });
    bus.$on("EditData", editData => {
      this.editedItem = editData;
    });
    bus.$on("UserDataChannel", userData => {
      this.userdata = userData;
    });
  }
};
</script>

<style>
.mytable {
  table-layout: fixed;
  padding: 0px;
}

.test {
  position: sticky;
}
</style>