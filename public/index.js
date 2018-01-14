/* global Vue, $, VueRouter, axios, Tone */
// import VueAudio from "vue-audio";

/* jquery */

var declanGainKnobVariable = 0;

$(document).ready(function() {
  $(function() {
    $(".dial").knob({
      change: function(value) {
        console.log(value);
      }
    });
  });
});

/* ^^^^ jquery */

var HomePage = {
  template: "#home-page"
};

var ProfilePage = {
  template: "#profile-page",
  data: function() {
    return {
      synths: [],
      newSynth: { name: "", tags: "", audioFile: "" },
      user: ""
    };
  },
  mounted: function() {
    axios.get("/v1/synths/private").then(
      function(response) {
        this.synths = response.data;
      }.bind(this)
    );
    // axios.get("/v1/users").then(
    //   function(response) {
    //     this.user = response.data;
    //   }.bind(this)
    // );
  },
  methods: {
    createSynth: function(event) {
      if (event.target.files.length > 0) {
        var formData = new FormData();
        formData.append("name", this.newSynth.name);
        formData.append("audioFile", event.target.files[0]);
      }
      axios.post("/v1/synths", formData).then(
        function(response) {
          this.name = "";
          event.target.value = "";
        }.bind(this)
      );
    },
    display: function() {
      var synth;

      var melodyList = ["C2", "D3", "E3", "F2", "G1", "A2", "B2", "C2"];
      synth = new Tone.Synth().toMaster();

      var melody = new Tone.Sequence(setPlay, melodyList).start();
      melody.loop = 1;

      Tone.Transport.bpm.value = 90;
      Tone.Transport.start();

      function setPlay(time, note) {
        synth.triggerAttackRelease(note, "2n", time);
      }
    },
    sampler: function() {
      axios.get("/v1/synths").then(function(response) {
        var sampleVar = new Tone.Sampler(
          {
            C3: response.data[0].url
          },
          function() {
            sampleVar.triggerAttack("C3");
          }
        );
        var gainValue = document.getElementById("gainKnob").change;
        console.log(declanGainKnobVariable);
        var delay = new Tone.FeedbackDelay("16n", 0.5).toMaster();
        sampleVar.connect(delay);
        var melody = new Tone.Sequence(setPlay).start();
        melody.loop = 1;
        Tone.Transport.bpm.value = 90;
        Tone.Transport.start();
        function setPlay(time, note) {
          sampleVar.triggerAttackRelease(note, "2n", time);
        }
      });
    }
  },
  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/profile");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/profile", component: ProfilePage }
  ]
});

var app = new Vue({
  el: "#app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
