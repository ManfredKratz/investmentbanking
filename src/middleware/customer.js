import axios from 'axios';
import { bus } from './../main';
import VueJwtDecode from 'vue-jwt-decode';
import AddCustomerComponent from "./../components/customer/AddCustomer.vue";
import ViewCustomerComponent from "./../components/customer/ViewCustomer.vue";
import EditCustomerComponent from "./../components/customer/EditCustomer.vue";

export default {
  components: {
    AddCustomerComponent,
    EditCustomerComponent,
    ViewCustomerComponent,
  },
  data() {
    return {
      userdata: {},
      portfolios: {},
      updatetCustomer: null,
      consultant_id: null,
      adminState: null,
      editedItem: {
        firstname: '',
        lastname: '',
        zip_code: '',
        city: '',
        street: '',
        country: '',
        nationality: '',
        family_status: '',
        email: ''
      },
      isLoggedIn: false,
      search: "",
      headers: [
        { text: "ID", align: "left", sortable: false, value: "customer_id" },
        { text: "Vorname", value: "firstname" },
        { text: "Nachname", value: "lastname" },
        { text: "Postleitzahl", value: "zip_code" },
        { text: "Ort", value: "city" },
        { text: "Straße", value: "street" },
        { text: "Aktionen", value: "action", sortable: false },
      ],
      content: [],
    }
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    } else { this.isLoggedIn == true }
    const token = localStorage.getItem("token");
    const TokenPayload = VueJwtDecode.decode(token);
    this.consultant_id = TokenPayload.user_information[0].consultant_id;
    this.adminState = TokenPayload.user_information[0].is_admin;
  },
  mounted() {
    this.initialize;
    var vm = this
    bus.$on('items-updated', function () {
      vm.initialize;
    })
    bus.$on('portfolio-updated-customer', data => {
      this.updatetCustomer = data;
    })
    var vm3 = this
    bus.$on('portfolio-updated', function() {
      vm3.letsetry();
    })

  },
  computed: {
    initialize() {
      let ConsultantInformation = {
        consultant_id: this.consultant_id
      }
      axios
        .post("http://localhost:8000/customer/", ConsultantInformation)
        .then(response => {
          this.content = response.data;
        })
        .catch(error => {
          console.log(error);
        })
      return this.content;
    }
  },
  methods: {
    letsetry() {
      let CustomerInformation = {
        customer_id: this.editedItem.customer_id
      }
      axios
        .post(
          "http://localhost:8000/customer/getPortfolio/", CustomerInformation
        )
        .then(response => {
          this.portfolios = response.data;
          bus.$emit('PortfolioData', this.portfolios)
          console.log("CUSTOMER.JS" + this.portfolios)
        })
        .catch(error => {
          console.log(error);
        });
    },
    editItem(item) {
      bus.$emit('editCustomer', this.editCustomer = true)
      bus.$emit('EditData', this.editedItem = Object.assign({}, item))
    },
    viewItem(item) {
      bus.$emit('viewCustomer', this.viewCustomer = true)
      bus.$emit('EditData', this.editedItem = Object.assign({}, item))
      let CustomerInformation = {
        customer_id: this.editedItem.customer_id
      }
      axios
        .post(
          "http://localhost:8000/customer/getPortfolio/", CustomerInformation
        )
        .then(response => {
          this.portfolios = response.data;
          bus.$emit('PortfolioData', this.portfolios)
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};