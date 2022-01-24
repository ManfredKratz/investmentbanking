import axios from "axios";
import { bus } from "./../main";
import VueJwtDecode from 'vue-jwt-decode';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMsg: null,
      isLoggedIn: false,
      userdata: {}
    }
  },
  created() {
    this.fetchUserDetails();
  },
  methods: {
    /**
     * [loginUser used to login the user]
     * @return {[type]} [none]
     */
    loginUser() {
      const { email, password } = this
      const data = { email, password }
      console.log(data)
      const URL = 'http://localhost:8000/user/login'
      axios.post(URL, data)
        .then(res => {
          localStorage.setItem('token', res.data.token)
          bus.$emit('LoggedInStatus', this.isLoggedIn == true)
          this.fetchUserDetails();
          bus.$emit('UserDataChannel', this.userdata);
          this.$router.go()
        })
        .catch(err => {
          this.errorMsg = "[INFO] Sie haben ungültige Anmeldedaten angegeben."
          // eslint-disable-next-line
          console.log(err)
        })
    },
    fetchUserDetails() {
      const token = localStorage.getItem("token");
      const TokenPayload = VueJwtDecode.decode(token);
      this.userdata.consultant_id = TokenPayload.user_information[0].consultant_id;
      this.userdata.bo_id = TokenPayload.user_information[0].bo_id;
      this.userdata.email = TokenPayload.user_information[0].email;
      this.userdata.firstname = TokenPayload.user_information[0].firstname;
      this.userdata.lastname = TokenPayload.user_information[0].lastname;
      this.userdata.qualification = TokenPayload.user_information[0].qualification;
      this.userdata.is_admin = TokenPayload.user_information[0].is_admin;
      bus.$emit('UserDataChannel', this.userdata);
      this.$router.push('/customer')
    },
  }
}