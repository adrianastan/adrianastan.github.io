// event = keyup or keydown
//https://github.com/grantjames/metronome/blob/master/README.md
var counter = document.getElementById('counter');

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
})


var metronome = new Metronome();
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
    metronome.repeatBars = parseInt(repeatBars.value);
    console.log("Repeat bars:"+repeatBars.value);
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
        console.log("Change value: "+radioButtons[i].value);
        metronome.change = radioButtons[i].value;
        return;
      }
    }
});


