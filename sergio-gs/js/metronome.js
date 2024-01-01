const circle1 = document.getElementById("circle1");
const circle2 = document.getElementById("circle2");
const circle3 = document.getElementById("circle3");
const circle4 = document.getElementById("circle4");

const {Renderer,
       Stave,
       StaveNote,
       Formatter,
       Beam, Dot
       } = Vex.Flow;


function dotted(staveNote, noteIndex = -1) {
  if (noteIndex < 0) {
    Dot.buildAndAttach([staveNote], {
      all: true
    });
  } else {
    Dot.buildAndAttach([staveNote], {
      index: noteIndex
    });
  }
  return staveNote;
}

//bass, ride, hihat
const weights = [[1,2],
                 [1,1,2,1,1,1,5,4,3,3,5,1,1,3,1],
                 [1,2,2]];

const limbWeights = [1,1,2];
       
// scores
const snareClefs = [[new StaveNote({keys: ['c/5'],duration: 'q'})]];
const bassClefs = [[new StaveNote({keys: ['f/4'],duration: 'q'})],
		   [new StaveNote({keys: ['f/4'],duration: '8'}), new StaveNote({keys: ['f/4'],duration: '8'})]
		  ];
		  
const hihatClefs = [[new StaveNote({keys: ['d/4/x2'],duration: 'q'})],
	            [new StaveNote({keys: ['d/4/x2'],duration: '8'}), new StaveNote({keys: ['d/4/x2'], duration: '8'})],
	            [new StaveNote({keys: ['a/4'],duration: '8r'}), new StaveNote({keys: ['d/4/x2'], duration: '8'})]	
	            ];	
	            
const rideClefs = [[new StaveNote({ keys: ['a/5/x2'], duration: 'q'})], //1
		   [new StaveNote({ keys: ['a/5/x2'], duration: '8'}), new StaveNote({ keys: ['a/5/x2'], duration: '8'})], //2
		   [new StaveNote({ keys: ['a/4'], duration: '8r'}), new StaveNote({ keys: ['a/5/x2'], duration: '8'})], //3
		   [new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}),new StaveNote({ keys: ['a/5/x2'], duration: '16'}),new StaveNote({ keys: ['a/5/x2'], duration: '16'})], //4
		   [new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}),new StaveNote({ keys: ['a/4'], duration: '8r'})], //5
		   [new StaveNote({ keys: ['a/4'], duration: '8r'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'})], //6
		   [dotted(new StaveNote({ keys: ['a/5/x2'], duration: '8', })), new StaveNote({ keys: ['a/5/x2'], duration: '16'}),],//7
		   [dotted(new StaveNote({ keys: ['a/4'], duration: '8r', })), new StaveNote({ keys: ['a/5/x2'], duration: '16'}),],//8
		   [new StaveNote({ keys: ['a/4'], duration: '16r', }), new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '8'})], //9
		   [new StaveNote({ keys: ['a/4'], duration: '16r', }), dotted(new StaveNote({ keys: ['a/5/x2'], duration: '8'}))], //10
		   [new StaveNote({ keys: ['a/4'], duration: '16r', }), new StaveNote({ keys: ['a/5/x2'], duration: '8'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'})], //11
		   [new StaveNote({ keys: ['a/5/x2'], duration: '8'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'})], //12
		   [new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}),new StaveNote({ keys: ['a/5/x2'], duration: '8'}), ], //13
		   [new StaveNote({ keys: ['a/4'], duration: '16r', }), new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '16'}),], //14	   
		   [new StaveNote({ keys: ['a/5/x2'], duration: '16'}), new StaveNote({ keys: ['a/5/x2'], duration: '8'}),new StaveNote({ keys: ['a/5/x2'], duration: '16'}), ], //15
		   ];	     


// Groove Scribe grooves
const bassGS = ["&K=|o-------o-------|", "&K=|o-o-----o-o-----|"];
const hihatGS = ["&K=|x---x---x---x---|", "&K=|x-x-x-x-x-x-x-x-|", "&K=|--x---x---x---x-|"];
const snareGS = ["&S=|----o-------o---|"];
const rideGS = ["&H=|r---r---r---r---|", "&H=|r-r-r-r-r-r-r-r-|", "&H=|--r---r---r---r-|", "&H=|rrrrrrrrrrrrrrrr|", "&H=|rr--rr--rr--rr--|", "&H=|--rr--rr--rr--rr|", "&H=|r--rr--rr--rr--r|", "&H=|---r---r---r---r|", "&H=|-rr--rr--rr--rr-|", "&H=|-r---r---r---r--|", "&H=|-r-r-r-r-r-r-r-r|", "&H=|r-rrr-rrr-rrr-rr|", "&H=|rrr-rrr-rrr-rrr-|", "&H=|-rrr-rrr-rrr-rrr|", "&H=|rr-rrr-rrr-rrr-r|"];



// class METRONOME
class Metronome
{
    constructor(tempo = 70)
    {
        this.audioContext = null;
        this.notesInQueue = [];    // notes that have been put into the web audio and may or may not have been played yet {note, time}
        this.currentBeatInBar = 0;
        this.beatsPerBar = 4;
        this.tempo = tempo;
        this.lookahead = 25;          // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1;   // How far ahead to schedule audio (sec)
        this.nextNoteTime = 0.0;     // when the next note is due
        this.isRunning = false;
        this.intervalID = null;
        this.counter = 0;
        this.rideRand = Math.floor(Math.random() * 8);
    	this.bassRand = Math.floor(Math.random() * 2);
    	this.hihatRand = Math.floor(Math.random() * 3);
        
    	// bass, ride, hihat
    	this.lengths = [bassClefs.length, rideClefs.length, hihatClefs.length]
    	this.randoms = [Math.floor(Math.random() * this.lengths[0]),
                        Math.floor(Math.random() * this.lengths[1]),
                        Math.floor(Math.random() * this.lengths[2])];
    	
    	this.repeatBars = 4;//document.getElementById('maxRepeat').value;
    	this.change = 0;
        this.weight = 0;
        this.played = [];
        this.max_combinations = bassClefs.length * rideClefs.length * hihatClefs.length;
        this.gs = new GrooveDisplay();
        this.clef();
    }
    

    nextNote()
    {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        var secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    
        this.currentBeatInBar++;    // Advance the beat number, wrap to zero
        if (this.currentBeatInBar == this.beatsPerBar) {
            this.currentBeatInBar = 0;
        }
    }

    scheduleNote(beatNumber, time)
    {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({ note: beatNumber, time: time });
    
        // create an oscillator
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        
        osc.frequency.value = (beatNumber % this.beatsPerBar == 0) ? 3000 : 2000;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);
    
        osc.start(time);
        osc.stop(time + 0.03);
    }

    scheduler(counter, repeatBars)
    {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
            
            //Reset circles
            circle1.style.color = "mediumseagreen";
            circle2.style.color = "mediumseagreen";
            circle3.style.color = "mediumseagreen";
            circle4.style.color = "mediumseagreen";
            switch(this.currentBeatInBar) {
                case 1:
                    circle1.style.color = "tomato";
                    break; 
                case 2:
                    circle2.style.color = "tomato";
                    break;
                case 3:
                    circle3.style.color = "tomato";
                    break;
                case 0:
                    circle4.style.color = "tomato";
                    break;     
            }
            
            
            if (this.currentBeatInBar == 1){
                //console.log(this.counter);
                this.counter += 1;
                if (this.counter == 0){
            		counter.style.background = 'tomato';
            		counter.textContent = "Count in";  
            	}
                          	
            	if (this.counter == repeatBars){
            		counter.style.background = 'tomato';
            		counter.textContent = this.counter;
            	}
            	else if (this.counter > 0){
                        counter.style.background = 'mediumseagreen';
                        counter.textContent = this.counter;
                }
            	
            	if (this.counter == repeatBars + 1){
            		counter.style.background = 'orange';
            		counter.textContent = "FILL";
            	}
            	if (this.counter == repeatBars + 2){
            		this.clef();
            		this.counter = 1;
            		counter.textContent = this.counter;
            	}
                
                if (this.counter > repeatBars + 2){
                    this.counter = 1;
            		counter.textContent = this.counter;
                }
            }
            
        }
    }

    start(){
        if (this.isRunning) return;
        this.played = [];
	    this.counter = -1;
        if (this.audioContext == null){
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        this.isRunning = true;
        this.currentBeatInBar = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;
        this.intervalID = setInterval(() => this.scheduler(counter, this.repeatBars), this.lookahead);      
    }


    stop(){
        this.isRunning = false;
        clearInterval(this.intervalID);
    }

    startStop(counter){
        if (this.isRunning) {
            this.stop();
            this.counter = -1;
            counter.textContent = 0;
            counter.style.background = 'dodgerblue';
        }
        else {
            this.start(counter);
        }
    }
    
    
    
   
 
    ////////////////////////////
    // MUSIC SCORE
    ///////////////////////////
    bass(elementid, rand){
        document.getElementById(elementid).innerHTML = '';
        const div = document.getElementById(elementid);
        const renderer = new Renderer(div, Renderer.Backends.SVG);
        renderer.resize(220, 90);
        const context = renderer.getContext();
        const stave = new Stave(0, 0, 200);
        stave.addClef('percussion').addTimeSignature('2/4');
        stave.setContext(context).draw();
        //notes
        var notes1 = bassClefs[rand];
        var notes2 = snareClefs[0];
        const allnotes = notes1.concat(notes2);
        const beams = Beam.generateBeams(allnotes);
        Formatter.FormatAndDraw(context, stave, allnotes);

        // Draw the beams and stems.
        beams.forEach((b) => {
          b.setContext(context).draw();
        });
    }
    
    
    //ride
    ride(elementid, rand){
        document.getElementById(elementid).innerHTML = '';
        const div = document.getElementById(elementid);
        const renderer = new Renderer(div, Renderer.Backends.SVG);
        renderer.resize(220, 120);
        const context = renderer.getContext();
        const stave = new Stave(0, 0, 200);
        stave.addClef('percussion').addTimeSignature('1/4');
        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();

        // Create the notes
        const notes1 = rideClefs[rand];
        const beams = Beam.generateBeams(notes1);
        Formatter.FormatAndDraw(context, stave, notes1);

        // Draw the beams and stems.
        beams.forEach((b) => {
          b.setContext(context).draw();
        });
    }
    
    /* hihat () */
    hihat(elementid, rand){
        document.getElementById(elementid).innerHTML = '';
        const div = document.getElementById(elementid);
        const renderer = new Renderer(div, Renderer.Backends.SVG);
        renderer.resize(210, 90);
        const context = renderer.getContext();
        const stave = new Stave(0, 0, 200);
        stave.addClef('percussion').addTimeSignature('1/4');
        stave.setContext(context).draw();

        // Create the notes
        const notes1 = hihatClefs[rand];
        const beams = Beam.generateBeams(notes1);

        Formatter.FormatAndDraw(context, stave, notes1);
        // Draw the beams and stems.
        beams.forEach((b) => {
          b.setContext(context).draw();
        });
    }
    
    
    weightedRandom(weights) { 
      // Preparing the cumulative weights array.
      // For example:
      // - weights = [1, 4, 3]
      // - cumulativeWeights = [1, 5, 8]
      const cumulativeWeights = [];
      for (let i = 0; i < weights.length; i += 1) {
        cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
      }
      // Getting the random number in a range of [0...sum(weights)]
      // For example:
      // - weights = [1, 4, 3]
      // - maxCumulativeWeight = 8
      // - range for the random number is [0...8]
      const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
      const randomNumber = maxCumulativeWeight * Math.random();
      // Picking the random item based on its weight.
      // The items with higher weight will be picked more often.
      for (let itemIndex = 0; itemIndex < weights.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
          return itemIndex;
        }
      }
    }
    
    /* 
        GENERATE WEIGHTED RANDOMS 
    */
    generateWeightedRandoms(){
        
    	if (this.change != 0){
    	    /* Can change any, but at least one */
    	    var randoms = [];
    	    do{
    	        randoms = [this.weightedRandom(weights[0]),
    			           this.weightedRandom(weights[1]),
    			           this.weightedRandom(weights[2])];
    	    } while (JSON.stringify(randoms) == JSON.stringify(this.randoms));
    	    this.randoms = randoms;
    	}  
    	else{
    	   /* Change only one limb */
            let limb = 0;
            let new_val = 0;
            do {
    	       limb = this.weightedRandom(limbWeights);
    	       new_val = this.weightedRandom(weights[limb]);
            } while (new_val == this.randoms[limb]);
    	   this.randoms[limb] = new_val;
    	}
    }
    
    /* -----------------
        GENERATE RANDOMS 
     ------------------- */
    generateRandoms(){
    	if (this.change != 0){
    	    /* can change any, but at least one */
    	    let randoms = [];  
            let val ="";
            let attempts = 0;
            do{
               randoms = [Math.floor(Math.random() * this.lengths[0]),
                    Math.floor(Math.random() * this.lengths[1]),
                    Math.floor(Math.random() * this.lengths[2])]; 
                val = JSON.stringify(randoms);
                attempts+=1;
            }
    	    while (((JSON.stringify(randoms) == JSON.stringify(this.randoms)) ||                        this.played.includes(val)) && attempts < 20 );
            
            this.played.push(val);
    	    this.randoms = randoms;
    	}  
    	else{
    	   /* change only one limb */
           let limb = 0;
           let new_val = 0;
           let val = '';
           let attempts = 0; //number of random selections so as not to block the app
           do{ 
               limb = Math.floor(Math.random() * 3);
    	       new_val = Math.floor(Math.random() * this.lengths[limb]);
               let clonedRandoms = JSON.parse(JSON.stringify(this.randoms))
               clonedRandoms[limb] = new_val;
               val = JSON.stringify(clonedRandoms);
               attempts+=1;
               console.log(val, this.played.includes(val));
           } while ((new_val == this.randoms[limb] || this.played.includes(val)) && (attempts<20));
           
    	   this.randoms[limb] = new_val;
           //val = JSON.stringify(this.randoms);
            if (!this.played.includes(val))
                    this.played.push(val);
           //console.log(this.played);
    	}
    }
    
    clefTempoUpdate(){
    	
    	//current
        this.bass('bassSnare', this.randoms[0]);
        document.getElementById('bassno').innerHTML = "&nbsp;A"+(this.randoms[0]+1)+".&nbsp;";
    	this.ride('ride', this.randoms[1]);
    	document.getElementById('rideno').innerHTML = "&nbsp;B"+(this.randoms[1]+1)+".&nbsp;";	

    	this.hihat('hihat', this.randoms[2]);
    	document.getElementById('hhno').innerHTML = "&nbsp;C"+(this.randoms[2]+1)+".&nbsp;";
    	
    	//Groove scribe
    	let groove = this.createGrooveScribeGroove(this.randoms);
    	//let groove = this.createGrooveScribeGroove([1,0,2]);
    	this.gs.AddGrooveDisplayToElementId('GrooveDisplay', groove, true, true, false);
    }
    
    
    
    clef(){
    	//current
        this.bass('bassSnare', this.randoms[0]);
        document.getElementById('bassno').innerHTML = "&nbsp;A"+(this.randoms[0]+1)+".&nbsp;";
    	this.ride('ride', this.randoms[1]);
    	document.getElementById('rideno').innerHTML = "&nbsp;B"+(this.randoms[1]+1)+".&nbsp;";	
    	this.hihat('hihat', this.randoms[2]);
    	document.getElementById('hhno').innerHTML = "&nbsp;C"+(this.randoms[2]+1)+".&nbsp;";
    	
    	//Groove scribe
    	let groove = this.createGrooveScribeGroove(this.randoms);
    	//let groove = this.createGrooveScribeGroove([1,0,2]);
    	this.gs.AddGrooveDisplayToElementId('GrooveDisplay', groove, true, true, false);	
    	//next
        if (this.weight == 0)
            this.generateWeightedRandoms();
        else
    	   this.generateRandoms();
        
        console.log(this.played);
        console.log(this.max_combinations, this.played.length)
        if (this.played.length == this.max_combinations){
                this.played = [];
                this.played.length = 0;  
            }	
        
    	this.bass('bassSnareNext', this.randoms[0]);
    	document.getElementById('bassnonext').innerHTML = "&nbsp;A"+(this.randoms[0]+1)+".&nbsp;";
    	this.ride('rideNext', this.randoms[1]);
    	document.getElementById('ridenonext').innerHTML = "&nbsp;B"+(this.randoms[1]+1)+".&nbsp;";
    	this.hihat('hihatNext', this.randoms[2]);
    	document.getElementById('hhnonext').innerHTML = "&nbsp;C"+(this.randoms[2]+1)+".&nbsp;";
    }
    
    
    ////////////////////////////
    // Groove Scribe
    ///////////////////////////
    createGrooveScribeGroove(randoms){
    	let stem = "?TimeSig=4/4&Div=16&Tempo=";
    	stem += this.tempo;
    	stem += "&Measures=1";
    	stem += rideGS[randoms[1]];
    	stem += snareGS[0];
    	
    	let kick = bassGS[randoms[0]];
    	let hh = hihatGS[randoms[2]];
    	let comb = '&K=|';
    	for (let i = 4; i < kick.length-1; i++) {
	  if (kick[i] != '-' && hh[i] != '-')
	  	comb += 'X';
	  else if (kick[i] != '-')
	         comb += 'o';
	  else if (hh[i] != '-')
	         comb += 'x';
	  else
	  	comb += '-';
	}   
	comb += '|';
    	
    	stem += comb;
	//console.log(stem);
    	
    	
    	return stem;
    
    }
    
    
    
}
    		
    
