import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode';
import AddConsultantComponent from "./../components/consultant/AddConsultant.vue";
import { bus } from './../main';

export default {
  name: "Customer",
  components: {
    AddConsultantComponent,
  },
  data() {
    return {
      branche_office: '',
      consultant_id: null,
      adminState: null,
    };

  },
  mounted() {
    this.initialize()
    var vm = this
    bus.$on('consultant-updated', function () {
      vm.initialize;
    })
  },
  methods: {
    initialize() {
      axios
        .get("http://localhost:8000/user/staffofbo")
        .then(response => {
          this.branche_office = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
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
};