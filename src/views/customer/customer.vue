<template>
  <v-card height="100%">
    <v-data-table :search="search" :headers="headers" :items="content">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="subtitle font-weight-bold">Kundenverwaltung {{userdata.firstname}}</v-toolbar-title>
          <template v-if="adminState === true"></template>
          <template v-else>
            <AddCustomerComponent></AddCustomerComponent>
          </template>
          <EditCustomerComponent></EditCustomerComponent>
          <ViewCustomerComponent></ViewCustomerComponent>
          <v-spacer></v-spacer>
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
      <template v-slot:item.customer_id="{ item }">
        <v-chip small color="#243B55" dark>{{ item.customer_id }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon @click="editItem(item)" class="mr-2" small>mdi-pencil</v-icon>
        <v-btn color="#333333" @click="viewItem(item)" dark x-small depressed>
          <v-icon left small>mdi-eye</v-icon>Depot
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script src="../../../src/middleware/customer.js"></script>

<style>
.smallFont {
  font-size: 12px;
}

.information-window-v-card-text {
  overflow-y: scroll;
}

.title-padding {
  padding: 25px 50px 0px 50px;
}
</style>