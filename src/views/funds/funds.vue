<template>
  <v-card height="100%">
    <v-data-table :search="search" :headers="headers" :items="content">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="subtitle font-weight-bold">Fonds</v-toolbar-title>
          <template v-if="adminState === true">
            <AddFundComponent></AddFundComponent>
            <EditFundComponent></EditFundComponent>
          </template>
          <template v-else></template>
          <ViewFundComponent></ViewFundComponent>
          <v-spacer></v-spacer>
                    <ShowFundComponent></ShowFundComponent>
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
      <!-- Expander-Informationen: Detailansicht zum Kunden -->

      <template v-slot:item.fund_id="{ item }">
        <v-chip small color="#F1F3F4">{{ item.fund_id }}</v-chip>
      </template>
      <template v-slot:item.isin="{ item }">
        <v-chip small color="#243B55" dark>{{ item.isin }}</v-chip>
      </template>

      <template v-slot:item.marketprice="{ item }">{{ item.marketprice }}€</template>
      <template v-slot:item.action="{ item }">
        <template v-if="adminState === true">
        <v-icon @click="editFunds(item)" class="mr-2" small>mdi-pencil</v-icon>
        </template>
        <v-icon @click="showFund(item)" small>mdi-eye</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script src="../../../src/middleware/funds.js"></script>

<style>
</style>