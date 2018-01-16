// function display() {
//   var synth;

//   var melodyList = ["C2", "D3", "E3", "F2", "G1", "A2", "B2", "C2"];
//   synth = new Tone.Synth().toMaster();

//   var melody = new Tone.Sequence(setPlay, melodyList).start();
//   melody.loop = 1;

//   Tone.Transport.bpm.value = 90;
//   Tone.Transport.start();

//   function setPlay(time, note) {
//     synth.triggerAttackRelease(note, "2n", time);
//   }
// }
// function changeSound(event) {
//   axios.get("/v1/synths").then(function(response) {
//     var synthOne = response.data[0].url;
//     var player = new Tone.Player({
//       url: synthOne,

//       autostart: true
//     }).toMaster();

//     player.start();
//   });
// }

// recordVar.connect(dest);
// Tone.js:1725 Uncaught Error: error connecting to node: [object MediaStreamAudioDestinationNode]
// InvalidAccessError: Failed to execute 'connect' on 'AudioNode': cannot connect to a destination belonging to a different audio context.
