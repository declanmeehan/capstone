/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global Vue, VueRouter, axios */
// import VueAudio from "vue-audio";

var HomePage = {
  template: "#home-page",
  data: function data() {
    return {
      synths: [],
      newSynth: { name: "", tags: "", audioFile: "" },
      user: ""
    };
  },
  mounted: function mounted() {
    axios.get("/v1/synths").then(function (response) {
      this.synths = response.data;
    }.bind(this));
    axios.get("/v1/users").then(function (response) {
      this.user = response.data;
    }.bind(this));
  },
  methods: {
    createSynth: function createSynth(event) {
      if (event.target.files.length > 0) {
        var formData = new FormData();
        formData.append("name", this.newSynth.name);
        formData.append("audioFile", event.target.files[0]);
      }
      axios.post("/v1/synths", formData).then(function (response) {
        console.log(response);
        this.name = "";
        event.target.value = "";
      }.bind(this));
    }
  },
  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function submit() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios.post("/v1/users", params).then(function (response) {
        router.push("/login");
      }).catch(function (error) {
        this.errors = error.response.data.errors;
      }.bind(this));
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function data() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function submit() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios.post("/user_token", params).then(function (response) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        localStorage.setItem("jwt", response.data.jwt);
        router.push("/");
      }).catch(function (error) {
        this.errors = ["Invalid email or password."];
        this.email = "";
        this.password = "";
      }.bind(this));
    }
  }
};

var LogoutPage = {
  created: function created() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var router = new VueRouter({
  routes: [{ path: "/", component: HomePage }, { path: "/signup", component: SignupPage }, { path: "/login", component: LoginPage }, { path: "/logout", component: LogoutPage }]
});

var app = new Vue({
  el: "#app",
  router: router,
  created: function created() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});

/***/ })
/******/ ]);