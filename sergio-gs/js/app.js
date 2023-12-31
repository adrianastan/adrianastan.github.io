// event = keyup or keydown
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

var tempoChangeButtons = document.getElementsByClassName('tempo-change');
for (var i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function() {
        metronome.tempo += parseInt(this.dataset.change);
        tempo.textContent = metronome.tempo;
    });
}


var repeatBars = document.getElementById("maxRepeat");
metronome.repeatBars = parseInt(repeatBars.value);
repeatBars.addEventListener('input', function() {
    if (parseInt(repeatBars.value)){
        metronome.repeatBars = parseInt(repeatBars.value);
    }
    else{
        metronome.repeatBars = 4;
        //console.log("Resetting repeat to 4");
    }
    //console.log("Repeat bars:"+repeatBars.value);
});





var radioButtons = document.getElementsByName("changer");
    // Loop through the radio buttons to find the selected one
for (var i = 0; i < radioButtons.length; i++) {
if (radioButtons[i].checked) {
    // Display the value of the selected radio button
    metronome.change = radioButtons[i].value;
}
}

document.forms["changerForm"].addEventListener("change", function() {
    var radioButtons = document.getElementsByName("changer");
    // Loop through the radio buttons to find the selected one
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        // Display the value of the selected radio button
        //console.log("Change value: "+radioButtons[i].value);
        metronome.change = radioButtons[i].value;
        return;
      }
    }
});



var radioButtons = document.getElementsByName("weighter");
    // Loop through the radio buttons to find the selected one
    for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
        // Display the value of the selected radio button
        metronome.weight = radioButtons[i].value;
    }
}

document.forms["weighterForm"].addEventListener("change", function() {
    var radioButtons = document.getElementsByName("weighter");
    // Loop through the radio buttons to find the selected one
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        // Display the value of the selected radio button
        //console.log("Weight value: "+radioButtons[i].value);
        metronome.weight = radioButtons[i].value;
        return;
      }
    }
});



function toggleSettings() {
  var settingsDiv = document.getElementById("options");

  // Toggle the visibility of the settings div
  if (settingsDiv.style.display === "none") {
    settingsDiv.style.display = "block";
    //console.log("switch to block");
  } else {
    settingsDiv.style.display = "none";
  }
}

var options = document.getElementById("options-btn");
options.addEventListener('click', function() {
	toggleSettings()
	//console.log("options active");
});



/*
var gs = new GrooveDisplay();
gs.AddGrooveDisplayToElementId('GrooveDisplay', "?TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=|xxxxxxxxxxxxxxxx|&S=|-O--O-O-----O---|&K=|o-X---o-o-X-----|", true, false);
			
window.addEventListener("load", function () {
	gs.AddGrooveDisplayToElementId('GrooveDisplay', "?TimeSig=4/4&Div=16&Tempo=70&Measures=1&H=|xxxxxxxxxxxxxxxx|&S=|-O--O-O-----O---|&K=|o-X---o-o-X-----|", true, false);
}, false);
*/
