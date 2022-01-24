<template>
  <v-dialog v-model="viewFund">
    <v-card color="test" flat tile>
      <v-container>
        <div class="d-flex pt-3 pr-3">
          <div class="overline pl-3">Fondsübersicht</div>
          <v-spacer />
          <v-btn x-small color="#F3F3F3" depressed @click="viewFund = !viewFund">
            <v-icon left>mdi-menu-down</v-icon>Weniger anzeigen
          </v-btn>
        </div>
        <div class="pl-3 pr-3 pt-3">
          <v-card color="gradient" elevation="8" width="100%" dark height="300">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline pb-4">
                  Kategorie:
                  <b>{{editedFund.fund_cat_text}}</b>
                </div>
                <v-list-item-title class="display-1 mb-2 d-flex">
                {{editedFund.fund_name}}
                <v-icon right large class="pb-2">mdi-poll</v-icon>
                </v-list-item-title>
                <v-list-item-subtitle class="pt-1 pb-3">
                  <v-chip color="#F3F3F3" light small class="mr-2">ISIN: {{editedFund.isin}}</v-chip>
                  <v-chip color="#F3F3F3" light small>WKN: {{editedFund.wkn}}</v-chip>
                  <br />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-card light flat color="#FAFAFA" class="d-flex justify-space-between" width="100%">
                <v-card class="ma-3" color="#fff" width="210" elevation="1">
                  <v-card-title class="overline font-weight-bold">Marktpreis</v-card-title>
                  <v-card-text class="display-1">
                    {{formatPrice(editedFund.marketprice)}}€
                  </v-card-text>
                </v-card>
                <v-card class="ma-3" align-text-center flat elevation="1" color="#fff" width="210">
                  <v-card-title class="overline font-weight-bold">Mindestanlagesumme</v-card-title>
                  <v-card-text class="display-1">
                    {{formatPrice(editedFund.lowest_invest)}}€
                  </v-card-text>
                </v-card>
                <v-card class="ma-3" flat color="#fff" elevation="1" width="210">
                  <v-card-title class="overline font-weight-bold">Ausgabeaufschlag</v-card-title>
                  <v-card-text class="display-1">{{editedFund.subscription_fee}}%</v-card-text>
                </v-card>
                <v-card class="ma-3" flat color="#fff" elevation="1" width="210">
                  <v-card-title class="overline font-weight-bold">Risikoklasse</v-card-title>
                  <v-card-text>
                    <template v-if="editedFund.risk_class_text == 'gewinnorientiert'">
                      <v-chip dark color="green">Gewinnorientiert</v-chip>
                    </template>
                    <template v-if="editedFund.risk_class_text == 'konservativ'">
                      <v-chip dark color="orange">Konservativ</v-chip>
                    </template>
                    <template v-if="editedFund.risk_class_text == 'spekulativ'">
                      <v-chip dark color="red">Spekulativ</v-chip>
                    </template>
                    <template v-if="editedFund.risk_class_text == 'sicherheitsorientiert'">
                      <v-chip dark color="blue">Sicherheitsorientiert</v-chip>
                    </template>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-list-item>
          </v-card>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { bus } from "../../main";

export default {
  data() {
    return {
      viewFund: false,
      editedFund: {}
    };
  },
  created() {
    bus.$on("viewFund", showView => {
      this.viewFund = showView;
    });
    bus.$on("EditFund", editFund => {
      this.editedFund = editFund;
    });
  },
  methods: {
        formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  }
};
</script>

