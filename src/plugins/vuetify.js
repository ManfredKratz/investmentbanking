import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import de from 'vuetify/src/locale/de.ts'

Vue.use(Vuetify);

/* Einbindung vom deutschen Sprachpacket */
export default new Vuetify({
  lang: {
    locales: { de, },
    current: 'de',
  },
});

Vue.component('my-component', {
  methods: {
    changeLocale() {
      this.$vuetify.lang.current = 'de'
    },
  },
})
