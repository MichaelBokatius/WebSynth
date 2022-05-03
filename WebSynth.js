/*
  TO DO:
    ADSR,
    Filter,
    Delay,
    Presets,
    Analysis and Visualization
*/

var modulatorOscType = 'sine';
var carrierOscType = 'sine';

function getSelectValue()
{
  modulatorOscType = document.getElementById("modulatorOscType").value;
  carrierOscType = document.getElementById("carrierOscType").value;

  //console.log("modulatorOsc: ", modulatorOscType);
  //console.log("carrierOsc: ", carrierOscType);
}

window.addEventListener("load", function () {

  var keyboard = new QwertyHancock({
    id: 'keyboard',
    width: 600,
    height: 150,
    startNote: 'C4',
    octaves: 2
  });

  var slider1 = document.getElementById("Volume");
  var output1 = document.getElementById("VolumeOut");
  var slider2 = document.getElementById("Detune");
  var output2 = document.getElementById("DetuneOut");
  var slider3 = document.getElementById("ModulationGain");
  var output3 = document.getElementById("ModulationGainOut");

  var context = new AudioContext();
  var masterVolume = context.createGain();
  var oscillators = {};
  var detune = 20;
  var modulationGain = 1000;

  masterVolume.gain.value = 0.1;
  masterVolume.connect(context.destination);

  output1.innerHTML = slider1.value;
  slider1.oninput = function () {
    output1.innerHTML = this.value;
    masterVolume.gain.value = (this.value * 0.01) / 4; // prevent clipping (mostly) 
  }
  output2.innerHTML = slider2.value;
  slider2.oninput = function () {
    output2.innerHTML = this.value;
    detune = this.value;
  }
  output3.innerHTML = slider3.value;
  slider3.oninput = function () {
    output3.innerHTML = this.value;
    modulationGain = this.value;
  }

  getSelectValue();
  
  keyboard.keyDown = function (note, frequency) {
    var modulator = context.createOscillator();
    var carrier = context.createOscillator();
    var modGain = context.createGain();
    modGain.gain.value = modulationGain;

    modulator.frequency.value = frequency;
    modulator.type = modulatorOscType;
    modulator.detune.value = detune;
    carrier.frequency.value = frequency;
    carrier.type = carrierOscType;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterVolume);
    oscillators[frequency] = [modulator, carrier];

    modulator.start(context.currentTime);
    carrier.start(context.currentTime);
  };

  keyboard.keyUp = function (note, frequency) {
    oscillators[frequency].forEach(function (oscillator) {
      oscillator.stop(context.currentTime);
    });
  };
});