/* global Vue, $, VueRouter, axios, Tone */
// import VueAudio from "vue-audio";
var declanDelayKnob = 0;
var declanFilterKnob = 0;
var declanPitchKnob = 0;
var declanMainSound = "";

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      isHomePage: true
    };
  }
};

var ProfilePage = {
  template: "#profile-page",

  data: function() {
    return {
      isHomePage: false,
      synths: [],
      checkedNotes: [],
      checkedNames: [],
      beatspm: [],
      newSynth: { name: "", tags: "", audioFile: "" },
      user: "",
      keyboardKeyNote: {
        a: "C5",
        w: "C#5",
        s: "D5",
        e: "D#5",
        d: "E5",
        f: "F5",
        t: "F#5",
        g: "G5",
        y: "G#5",
        h: "A5",
        u: "A#5",
        j: "B5"
      }
    };
  },
  created: function() {
    //plays audio from pressing certain key
    // window.addEventListener("keydown", function(e) {
    //   const audio = document.querySelector(`audio[data-key="${e.keyCode}" ]`);
    //   if (!audio) return;
    // stop the function from running
    //   audio.play();
    // });
  },
  mounted: function() {
    axios.get("/v1/synths/private").then(
      function(response) {
        // this.synths = response.data;
        // var index = 0;
        // this.synths.forEach(
        //   function(synth) {
        //     console.log("keyboardKeyNote in loop", this.keyboardKeyNote, index);
        //     Vue.set(synth, "note", this.keyboardKeyNote[index]);
        //     index += 1;
        //   }.bind(this)
        // );
        // console.log("....", this.keyboardKeyNote);
        // console.log("....", Object.keys(this.keyboardKeyNote);
        let index = 0;
        let keyboardKeyNoteKeys = Object.keys(this.keyboardKeyNote);
        this.synths = response.data.map(synth => {
          synth.note = this.keyboardKeyNote[keyboardKeyNoteKeys[index]];
          index += 1;
          return synth;
        });
        $(document).ready(function() {
          $(function() {
            $(".beatspm").knob({
              height: 50,
              width: 50,
              min: 80,
              max: 210,
              change: function(value) {
                this.beatspm = value;
                console.log("bpm" + this.beatspm);
              }
            });
          });
        });

        // console.log("keyboardKeyNote", this.keyboardKeyNote);
        // let index = 0,
        //   kkn = this.keyboardKeyNote;
        // this.synths = response.data.map(synth => {
        //   console.log("attach", synth, index, kkn[index]);
        //   synth.note = kkn[index];
        //   index += 1;
        //   return synth;
        // });
      }.bind(this)
    );
  },
  updated: function() {
    console.log(this.beatspm);
    console.log("checkedS!!!!!", this.checkedNotes);
    var toneSamplerObject = {};
    this.synths.forEach(function(synth) {
      toneSamplerObject[synth.note] = synth.url;
    });

    var piano = new Tone.Sampler(toneSamplerObject, {
      release: 1
      // baseUrl: "./toneAudio/salamander/"
    }).toMaster();

    var keyboard = document.addEventListener("keydown", event => {
      var keyName = event.key;
      var note = this.keyboardKeyNote[keyName];
      // var note = "a";

      // switch (keyName) {
      //   case "a":
      //     note = "A5";
      //     break;
      // }
      console.log("KEYNAME NOOOTEEE", keyName, note);
      piano.triggerAttack(note);
    });

    // GUI //

    // var a = new Interface.Panel({
    //   container: document.querySelector("#pianoPanel")
    // });

    // var b = new Interface.Piano({
    //   bounds: [0, 0, 1, 0.5],
    //   startletter: "C",
    //   startoctave: 3,
    //   endletter: "C",
    //   endoctave: 5,
    //   noteLabels: false
    // });
    // var c = new Interface.Piano({
    //   bounds: [0, 0.5, 1, 0.5],
    //   startletter: "C",
    //   startoctave: 3,
    //   endletter: "C",
    //   endoctave: 4
    // });

    // a.background = "black";
    // a.add(b, c);
    // var keyboard = Interface.Keyboard();
    // keyboard.keyDown = function(note) {
    //   piano.triggerAttack(note);
    // };
    // keyboard.keyUp = function(note) {
    //   piano.triggerRelease(note);
    // };
    // Interface.Loader();
  },
  methods: {
    addNote: function(event) {
      this.checkedNotes.push(event.currentTarget.innerHTML);
      console.log(this.checkedNotes);
    },
    removeNote: function(index) {
      this.checkedNotes.splice(index, 1);
    },
    AddSample: function(synth, note) {
      // console.log(event.target);
      synth.note = note;
    },
    FullSynth: function() {
      var sampleVar = new Tone.Sampler({
        C3: this.synths[0].url
      });
    },
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
    melody: function() {
      var synth;

      var melodyList = this.checkedNotes;
      synth = new Tone.Synth().toMaster();

      var melody = new Tone.Sequence(setPlay, melodyList).start();
      melody.loop = 0;
      Tone.Transport.bpm.value = 180;
      Tone.Transport.start();

      function setPlay(time, note) {
        synth.triggerAttackRelease(note, "8n", time);
      }
    },
    sampler: function() {
      axios.get("/v1/synths").then(function(response) {
        var sampleVar = new Tone.Sampler(
          {
            C4: "C4",
            D4: "D4",
            E4: "E4",
            F4: "F4"
          },
          function() {
            sampleVar.triggerAttack("C4");
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
      isHomePage: false,
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
      isHomePage: false,
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
      isHomePage: false,
      synths: [],
      // name: [],
      tags: [],
      tagIds: [],
      audioContext: null
    };
  },
  created: function() {
    this.audioContext = new AudioContext();
    Tone.setContext(this.audioContext);
    console.log(this.tags);
    axios.get("/v1/synths/" + this.$route.params.id).then(
      function(response) {
        this.synths = response.data;
        console.log("get request tags", this.tags);
      }.bind(this)
    );
  },
  mounted: function() {
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
    this.getTags();
    // this.tags.forEach(function(index) {
    //   var span = document.createElement("span");
    //   $(span)
    //     .addClass("inner badge badge-primary")
    //     .attr("id", index.id)
    //     .html(index.name + " &times;");
    //   $("#dropContainer").append(span);
    // });
    // $(span).on(
    //   "click",
    //   function() {
    //     $(span).remove();
    //   }.bind(this)
    // );
  },

  methods: {
    getTags: function() {
      this.tags = this.synths[0].tags;
      this.tags.forEach(function(index) {
        //if there is not already a span with tag id
        // if ($("#dropContainer").not(':has($span).attr("id", index.id)'))
        if (document.getElementsByClassName(index.id).length === 0) {
          console.log("index" + index.id);
          var span = document.createElement("span");
          $(span)
            .addClass("inner badge badge-primary" + " " + index.id)
            .attr("id", index.id)
            .html(index.name + " &times;");
          $("#dropContainer").append(span);
        }
      });
    },
    createTags: function(event) {
      // var that = this.tags;
      var dropText = event.currentTarget.textContent;
      var clickId = event.currentTarget.id;

      console.log("click Id", clickId);
      if (document.getElementsByClassName(clickId).length === 0) {
        var span = document.createElement("span");
        $(span)
          .addClass("inner badge badge-primary" + " " + clickId)
          .attr("id", clickId)
          .html(dropText + " &times;");
        $("#dropContainer").append(span);
        var params = {
          synth_id: this.synths[0].id,
          tag_id: Number(clickId)
        };
        console.log(params);
        axios.post("/synth_tags", params);
      }
      // this.tagIds.push(clickId);
    },
    removeTags: function() {
      var currtag = "";
      var removetagsynthid = this.synths[0].id;
      $("#dropContainer")
        .children()
        .each(function() {
          var $span = $(this);
          $span.on(
            "click",
            function() {
              currtag = $(this).attr("id");
              var params = {
                synth_id: removetagsynthid,
                tag_id: Number(currtag)
              };
              axios.delete("/synth_tags", params);
              console.log("this is params", params);
              $span.remove();
            }.bind(this)
          );
        });
    },
    submit: function() {
      // var tagIdsArr = [];
      // $("#dropContainer")
      //   .children()
      //   .each(function(index) {
      //     var $span = $(this);
      //     var spanId = $span.attr("id");
      //     tagIdsArr.push(Number(spanId));
      //   });
      // tagIdsArr.filter(Boolean);
      // console.log(tagIdsArr);
      var params = {
        name: this.synths[0].name
      };
      // var tagParams = [];
      // for (var i = 0; i <= tagIdsArr.length; i++) {
      //   tagParams.push({ synth_id: this.synths[0].id, tag_id: tagIdsArr[i] });
      // }
      // axios.patch("/synth_tags/", tagParams);

      // console.log(tagParams);

      axios.patch("/v1/synths/" + this.$route.params.id, params);
      router.push("/profile");
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
      var capturing = false;
      // Tone.setContext(ac);
      var recorder = new MediaRecorder(stream);

      var recordVar = new Tone.Sampler(
        {
          C3: this.synths[0].url
        },
        function() {}
      );
      var delay = new Tone.FeedbackDelay("16n", declanDelayKnob).toMaster();
      var filter = new Tone.Filter(declanFilterKnob, "bandpass").toMaster();
      var pitch = new Tone.PitchShift(declanPitchKnob).toMaster();
      //connections

      recordVar.chain(filter, delay, pitch).toMaster();

      //   var canvas = document.querySelector("canvas");
      //   var audio = document.querySelector("audio");
      //   var stream = canvas.captureStream();
      //   audio.srcObject() = stream;

      //   var b = document.getElementById("recordId");
      //   var clicked = false;
      //   var chunks = [];
      //   var ac = new this.audioContext();
      //   var osc = ac.createOscillator();
      //   var dest = ac.createMediaStreamDestination();
      //   var mediaRecorder = new MediaRecorder(dest.stream);
      //   recordVar.context;
      //   Tone.setContext(ac);
      //   recordVar.connect(ac.destination);

      //   b.addEventListener("click", function(e) {
      //     if (!clicked) {
      //       mediaRecorder.start();
      //       osc.start(0);
      //       recordVar;
      //       e.target.innerHTML = "Stop recording";
      //       clicked = false;
      //     } else {
      //       mediaRecorder.stop();
      //       osc.stop(0);
      //       e.target.disabled = false;
      //     }
      //   });

      //   mediaRecorder.ondataavailable = function(evt) {
      //     // push each chunk (blobs) in an array
      //     chunks.push(evt.data);
      //   };

      //   mediaRecorder.onstop = function(evt) {
      //     // Make blob out of our blobs, and open it.
      //     var blob = new Blob(chunks, { type: "audio/x-wav; codecs=opus" });
      //     document.querySelector("audio").src = URL.createObjectURL(blob);
      //   };
    }
  }
};

var ShowTagPage = {
  template: "#show-tag-page",
  data: function() {
    return {
      isHomePage: false,
      synths: [],
      tag: {}
    };
  },
  created: function() {
    axios.get("/v1/tags/" + this.$route.params.id).then(
      function(response) {
        this.tag = response.data;
        this.synths = response.data.synths;
      }.bind(this)
    );
  },
  //NOT WORKING, GRAB EVERY SYNTH AND THEN CHECK IF EACH TAG ID EQUALS PAGE NUMBER
  // updated: function() {
  //   var itemId = Number(this.$route.params.id);
  //   this.synths.forEach(
  //     function(i) {
  //       i.tags.forEach(
  //         function(n) {
  //           console.log(n.id, itemId);
  //           //These are correct synth tag id and page id
  //           if (n.id === itemId) {
  //             console.log(n);
  //             this.tags.push(i);
  //           }
  //         }.bind(this)
  //       );
  //     }.bind(this)
  //   );
  // },
  methods: {
    testing: function() {
      console.log("tags", this.tags);
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
    { path: "/tags/:id", component: ShowTagPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#app",
  router: router,
  data: function() {
    return {
      isHomePage: false
    };
  },
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  },
  watch: {
    $route: function() {
      console.log("route changed?");
      location.reload();
    }
  }
});
