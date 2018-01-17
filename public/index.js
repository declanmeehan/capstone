/* global Vue, $, VueRouter, axios, Tone */
// import VueAudio from "vue-audio";
var declanDelayKnob = 0;
var declanFilterKnob = 0;
var declanPitchKnob = 0;
var declanMainSound = "";

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
      synths: [],
      name: [],
      tags: [],
      audioContext: null
    };
  },
  created: function() {
    this.audioContext = new AudioContext();
    Tone.setContext(this.audioContext);
  },
  mounted: function() {
    axios.get("/v1/synths/" + this.$route.params.id).then(
      function(response) {
        this.synths = response.data;
        this.tags = response.data[0].tags;
      }.bind(this)
    );
    /* jquery */
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
  },
  updated: function() {
    this.tags.forEach(function(index) {
      var span = document.createElement("span");
      $(span)
        .addClass("inner badge badge-primary")
        .html(index + " &times;");
      $("#container").append(span);
      $(span).on("click", function() {
        $(span).remove();
      });
    });
  },

  methods: {
    createTags: function(event) {
      // var that = this.tags;
      var dropText = event.currentTarget.id;
      console.log(dropText);
      var span = document.createElement("span");
      $(span)
        .addClass("inner badge badge-primary")
        .html(dropText + " &times;");
      $("#container").append(span);
      this.tags.push(dropText);

      $(span).on(
        "click",
        function() {
          $(span).remove();
          this.tags.shift();
        }.bind(this)
      );
      console.log(this.tags);
    },
    submit: function() {
      var params = {
        name: this.synths[0].name,
        tags: this.tags
      };
      console.log(params);

      axios.patch("/v1/synths/" + this.$route.params.id, params);
      console.log("success");
    },
    playSample: function() {
      console.log("the audioContext is", this.audioContext);
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

      sampleVar.chain(filter, delay, pitch).toMaster();
      // declanMainSound;
      // filter.connect(delay);
      // sampleVar.connect(pitch);

      // end connections

      // var melody = new Tone.Sequence(setPlay).start();
      // melody.loop = 1;
      // Tone.Transport.bpm.value = 90;
      // Tone.Transport.start();
      // function setPlay(time, note) {
      //   sampleVar.triggerAttackRelease(note, "2n", time);
      // }
    },
    /* ^^^^ jquery */
    recordButton: function() {
      // Tone.setContext(ac);
      var recordVar = new Tone.Sampler(
        {
          C3: this.synths[0].url
        },
        function() {
          recordVar.triggerAttack("C3");
        }
      );
      var delay = new Tone.FeedbackDelay("16n", declanDelayKnob).toMaster();
      var filter = new Tone.Filter(declanFilterKnob, "bandpass").toMaster();
      var pitch = new Tone.PitchShift(declanPitchKnob).toMaster();
      //connections

      recordVar.chain(filter, delay, pitch).toMaster();

      var b = document.getElementById("recordId");
      var clicked = false;
      var chunks = [];
      var ac = this.audioContext;
      var osc = ac.createOscillator();
      var dest = ac.createMediaStreamDestination();
      var mediaRecorder = new MediaRecorder(dest.stream);
      recordVar.context;
      Tone.setContext(ac);
      recordVar.connect(dest);

      b.addEventListener("click", function(e) {
        if (!clicked) {
          mediaRecorder.start();
          osc.start(0);

          recordVar;
          e.target.innerHTML = "Stop recording";
          clicked = true;
        } else {
          mediaRecorder.stop();
          osc.stop(0);
          e.target.disabled = true;
        }
      });

      mediaRecorder.ondataavailable = function(evt) {
        // push each chunk (blobs) in an array
        chunks.push(evt.data);
      };

      mediaRecorder.onstop = function(evt) {
        // Make blob out of our blobs, and open it.
        var blob = new Blob(chunks, { type: "audio/x-wav; codecs=opus" });
        document.querySelector("audio").src = URL.createObjectURL(blob);
      };
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
    { path: "/synths/edit/:id", component: EditSynthPage },
    { path: "/tags/:id", component: EditSynthPage }
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
