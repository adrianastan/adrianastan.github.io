//https://github.com/grantjames/metronome/blob/master/README.md

var counter = document.getElementById('counter');

var metronome = new Metronome();

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    metronome.startStop(counter);
    
    if (metronome.isRunning) {
        playPauseIcon.className = 'pause';
    }
    else {
        playPauseIcon.className = 'play';
        
    }
  }
});

var tempo = document.getElementById('tempo');
tempo.textContent = metronome.tempo;

/* PLAY - PAUSE */
var playPauseIcon = document.getElementById('play-pause-icon');
var playButton = document.getElementById('play-button');
playButton.addEventListener('click', function() {
    metronome.startStop(counter);
    
    if (metronome.isRunning) {
        playPauseIcon.className = 'pause';
    }
    else {
        playPauseIcon.className = 'play';
        
    }
});

/* TEMPO CHANGE */
var tempoChangeButtons = document.getElementsByClassName('tempo-change');
for (var i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function() {
        metronome.tempo += parseInt(this.dataset.change);
        metronome.clefTempoUpdate();
        tempo.textContent = metronome.tempo;
    });
}


/* MAX REPEAT */
var repeatBars = document.getElementById("maxRepeat");
metronome.repeatBars = parseInt(repeatBars.value);
repeatBars.addEventListener('input', function() {
    if (parseInt(repeatBars.value)){
        metronome.repeatBars = parseInt(repeatBars.value);
    }
    else{
        metronome.repeatBars = 4;
    }
});




/* CHANGER */
var radioButtons = document.getElementsByName("changer");
for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
        metronome.change = radioButtons[i].value;
    }
}

document.forms["changerForm"].addEventListener("change", function() {
    var radioButtons = document.getElementsByName("changer");
    for (var i = 0; i < radioButtons.length; i++) {
          if (radioButtons[i].checked) {
            metronome.change = radioButtons[i].value;
            return;
          }
        }
});



/* WEIGHTER */
var radioButtons = document.getElementsByName("weighter");
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            // Display the value of the selected radio button
            metronome.weight = radioButtons[i].value;
        }
}

document.forms["weighterForm"].addEventListener("change", function() {
    var radioButtons = document.getElementsByName("weighter");
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        metronome.weight = radioButtons[i].value;
        return;
      }
    }
});



/* Toggle settings */
function toggleSettings() {
  var settingsDiv = document.getElementById("options");
  // Toggle the visibility of the settings div
  if (settingsDiv.style.display === "none") {
    settingsDiv.style.display = "block";
  } else {
    settingsDiv.style.display = "none";
  }
}

var options = document.getElementById("options-btn");
options.addEventListener('click', function() {
	toggleSettings()
});


/*
var gs = new GrooveDisplay();
gs.AddGrooveDisplayToElementId('GrooveDisplay', "?TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=|xxxxxxxxxxxxxxxx|&S=|-O--O-O-----O---|&K=|o-X---o-o-X-----|", true, false);
			
window.addEventListener("load", function () {
	gs.AddGrooveDisplayToElementId('GrooveDisplay', "?TimeSig=4/4&Div=16&Tempo=70&Measures=1&H=|xxxxxxxxxxxxxxxx|&S=|-O--O-O-----O---|&K=|o-X---o-o-X-----|", true, false);
}, false);
*/
