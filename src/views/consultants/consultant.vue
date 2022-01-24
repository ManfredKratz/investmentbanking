<template>
  <v-card height="100%">
    <v-toolbar flat>
      <v-toolbar-title class="subtitle font-weight-bold">Beraterübersicht</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="adminState === true">
        <AddConsultantComponent></AddConsultantComponent>
      </template>
      <template v-else></template>
    </v-toolbar>

    <v-expansion-panels accordion tile>
      <template>
        <v-expansion-panel v-for="(item,i) in branche_office" :key="i">
          <v-expansion-panel-header class="pa-6" color="#FAFBFC">
            <v-layout row wrap pl-3>
              <v-flex xs4 sm4 md3>
                <v-chip label color="#1E3047" dark>
                  <v-chip color="white" light class="mr-2" x-small>{{item.bo_id}}</v-chip>
                  {{item.city}}
                  <v-icon small class="ml-3 mr-1" left>mdi-home-city</v-icon>
                </v-chip>
              </v-flex>
              <v-flex xs4 sm4 md3>
                <div class="caption grey--text">Adresse</div>
                <div>{{item.zip_code}} {{item.city}}, {{item.street}}</div>
              </v-flex>
            </v-layout>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="gradient-1">
            <template>
              <div class="mt-5">
                <v-card
                  v-for="(items,i) in item.consultants[0]"
                  :key="i"
                  elevation="1"
                  class="mt-1 mb-1"
                  color="#FAFBFC"
                >
                  <v-list-item class="grow smallFont">
                    <v-list-item-avatar>
                      <template v-if="items.sex == 'm'">
                        <v-img src="../../assets/avatar.svg"></v-img>
                      </template>
                      <template v-else>
                        <v-img src="../../assets/avatar-f.svg"></v-img>
                      </template>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <template v-if="items.sex == 'm'">
                        <v-list-item-title
                          class="subtitle-1"
                        >Hr. {{items.firstname}} {{items.lastname}}</v-list-item-title>
                      </template>
                      <template v-else>
                        <v-list-item-title
                          class="subtitle-1"
                        >Fr. {{items.firstname}} {{items.lastname}}</v-list-item-title>
                      </template>
                      <v-list-item-subtitle class="subtitle-2">
                        <v-chip class="mb-2" dark x-small>Berater-ID: {{items.consultant_id}}</v-chip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-flex xs4 sm4 md4>
                      <div class="caption grey--text">Qualifikation</div>
                      <div>
                        <v-icon small left>mdi-certificate</v-icon>
                        {{items.qualification}}
                      </div>
                    </v-flex>
                    <v-flex xs4 sm4 md4>
                      <div class="caption grey--text">E-Mail</div>
                      <div>
                        <v-icon small left>mdi-email</v-icon>
                        {{items.email}}
                      </div>
                    </v-flex>
                  </v-list-item>
                </v-card>
              </div>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
  </v-card>
</template>
<script src="../../../src/middleware/consultants.js">
</script>

<style>
.v-expansion-panel:before {
  box-shadow: none !important;
  border-top: 1px solid red;
}

.smallFont {
  font-size: 14px;
}
</style>