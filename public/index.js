/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      synths: [],
      newSynth: { name: "", tags: "", fileName: "" }
    };
  },
  mounted: function() {
    axios.get("/v1/synths").then(
      function(response) {
        this.synths = response.data;
      }.bind(this)
    );
  },
  methods: {
    createSynth: function() {
      var params = {
        name: this.newSynth.name,
        fileName: this.newSynth.fileName
      };
      axios.post("/v1/synths", params).then(
        function(response) {
          this.newSynth = { name: "", tags: "", fileName: "" };
        }.bind(this)
      );
    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [{ path: "/", component: HomePage }]
});

var app = new Vue({
  el: "#app",
  router: router
});
