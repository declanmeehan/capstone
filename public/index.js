/* global Vue, $, VueRouter, axios, Tone */
// import VueAudio from "vue-audio";

/* jquery */
var oscillator = new Tone.Oscillator();

var declanDelayKnob = 0;
$(document).ready(function() {
  $(function() {
    $(".delay-dial").knob({
      height: 50,
      width: 50,
      change: function(value) {
        declanDelayKnob = value / 100;
        console.log("delay" + declanDelayKnob);
      }
    });
  });
});
var declanFilterKnob = 0;
$(document).ready(function() {
  $(function() {
    $(".filter-dial").knob({
      height: 50,
      width: 50,
      change: function(value) {
        declanFilterKnob = value * 10;
        console.log("filter is" + declanFilterKnob);
      }
    });
  });
});
var declanPitchKnob = 0;
$(document).ready(function() {
  $(function() {
    $(".pitch-dial").knob({
      height: 50,
      width: 50,
      change: function(value) {
        declanPitchKnob = value / 10;
        console.log("pitch is" + declanPitchKnob);
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
        var delay = new Tone.FeedbackDelay("16n", declanDelayKnob).toMaster();
        var filter = new Tone.Filter(declanFilterKnob, "bandpass").toMaster();
        var pitch = new Tone.PitchShift(declanPitchKnob).toMaster();

        //connections

        sampleVar.connect(filter);
        filter.connect(delay);
        sampleVar.connect(pitch);

        // end connections

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

var AlbumPage = {
  template: "#album-page"
};

var EditSynthPage = {
  template: "#edit-synth-page",
  data: function() {
    return {
      synths: []
    };
  },
  mounted: function() {
    axios.get("/v1/synths/" + this.$route.params.id).then(
      function(response) {
        this.synths = response.data;
        console.log(this.synths[0].url);
      }.bind(this)
    );
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name
        // input_last: this.last_name,
        // input_email: this.email,
        // input_phone: this.phone_number
      };
      axios.patch("/v1/synths/" + this.$route.params.id, params);
    },
    playSample: function() {
      var sampleVar = new Tone.Sampler(
        {
          C3: this.synths[0].url
        },
        function() {
          sampleVar.triggerAttack("C3");
        }
      );
      var delay = new Tone.FeedbackDelay("16n", declanDelayKnob).toMaster();
      var filter = new Tone.Filter(declanFilterKnob, "bandpass").toMaster();
      var pitch = new Tone.PitchShift(declanPitchKnob).toMaster();

      //connections

      sampleVar.connect(filter);
      filter.connect(delay);
      sampleVar.connect(pitch);

      // end connections

      var melody = new Tone.Sequence(setPlay).start();
      melody.loop = 1;
      Tone.Transport.bpm.value = 90;
      Tone.Transport.start();
      function setPlay(time, note) {
        sampleVar.triggerAttackRelease(note, "2n", time);
        console.log(this.synths.url);
      }
    }
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/profile", component: ProfilePage },
    { path: "/album", component: AlbumPage },
    { path: "/synths/edit/:id", component: EditSynthPage }
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
