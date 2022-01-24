import axios from 'axios';
import { bus } from './../main';
import VueJwtDecode from 'vue-jwt-decode';
import ViewFundComponent from "./../components/funds/ViewFund.vue";
import EditFundComponent from "./../components/funds/EditFund.vue";
import AddFundComponent from "./../components/funds/AddFund.vue";
import ShowFundComponent from "./../components/funds/SearchFund.vue";

export default {
  components: {
    ViewFundComponent,
    EditFundComponent,
    AddFundComponent,
    ShowFundComponent
  },
  data() {
    return {
      search: "",
      editedFund: {
        fund_id: '',
        isin: '',
        wkn: '',
        fund_name: '',
        fund_cat_text: '',
        marketprice: '',
        lowest_invest: '',
        subscription_fee: '',
        risk_class_text: null,
      },
      consultant_id: null,
      adminState: false,
      isLoggedIn: false,
      headers: [
        { text: "Fonds-ID", value: "fund_id", sortable: false, },
        { text: "ISIN", value: "isin" },
        { text: "Fondsname", value: "fund_name" },
        { text: "WKN", value: "wkn" },
        { text: "Marktpreis", value: "marketprice" },
        { text: "Kategorie", value: "fund_cat_text" },
        { text: "Aktion", value: "action", sortable: false },
      ],
      content: [],
    }
  },
  mounted() {
    this.initialize;
    var vm = this
    bus.$on('funds-updated', function () {
      vm.initialize;
    })
  },
  computed: {
    initialize() {
      axios
        .get("http://localhost:8000/fund")
        .then(response => {
          this.content = response.data;
        })
        .catch(error => {
          console.log(error);
        });
      return this.content
    },
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }
    const token = localStorage.getItem("token");
    const TokenPayload = VueJwtDecode.decode(token);
    this.consultant_id = TokenPayload.user_information[0].consultant_id;
    this.adminState = TokenPayload.user_information[0].is_admin;
  },
  methods: {
    editFunds(item) {
      bus.$emit('editFund', this.editFund = true)
      bus.$emit('EditFund', this.editedFund = Object.assign({}, item))
    },
    showFund(item) {
      bus.$emit('viewFund', this.viewFund = true)
      bus.$emit('EditFund', this.editedFund = Object.assign({}, item))
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  }
};