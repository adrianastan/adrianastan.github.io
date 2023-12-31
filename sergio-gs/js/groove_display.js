// groove_display.js
// utility functions to support displaying a groove on a page
//
// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Author: Lou Montulli
// Original Creation date: Feb 2015.
//
//  Copyright 2015-2020 Lou Montulli, Mike Johnston
//
//  This file is part of Project Groove Scribe.
//
//  Groove Scribe is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 2 of the License, or
//  (at your option) any later version.
//
//  Groove Scribe is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Groove Scribe.  If not, see <http://www.gnu.org/licenses/>.

/*jshint multistr: true */
/*jslint browser:true devel:true */
/*jslint evil: true */
/*global GrooveUtils, GrooveDisplay */

// GrooveDisplay class.   The only one in this file.

class GrooveDisplay{
		constructor(){
			
			

		}


		
		

		// time signature looks like this  "4/4", "5/4", "6/8", etc
		// Two numbers separated by a slash
		// return an array with two elements top and bottom in that order
		parseTimeSignature(timeSig) {

			var timeSigTop = 4;
			var timeSigBottom = 4;

			if (timeSig) {
				var splitResults = timeSig.split("/");

				if (splitResults.length == 2) {
					timeSigTop = Math.ceil(splitResults[0]);
					timeSigBottom = Math.ceil(splitResults[1]);
				}
			}

			return [timeSigTop, timeSigBottom];
		}

		// Used by the GrooveDB to display a groove on a page.
		// Supports multiple grooves on one page as well.
		// shows the groove via SVG sheet music and a midi player
		GrooveDBFormatPutGrooveInHTMLElement(HtmlTagId, GrooveDBTabIn) {
			var myGrooveUtils = new GrooveUtils();
			var myGrooveData = new myGrooveUtils.grooveDataNew();

			var combinedSnareTab = myGrooveUtils.mergeDrumTabLines(GrooveDBTabIn.snareAccentTab, GrooveDBTabIn.snareOtherTab);
			var combinedKickTab = myGrooveUtils.mergeDrumTabLines(GrooveDBTabIn.kickTab, GrooveDBTabIn.footOtherTab);

			if(GrooveDBTabIn.div !== undefined && !isNaN(GrooveDBTabIn.div)) myGrooveData.timeDivision = GrooveDBTabIn.div;
			if(GrooveDBTabIn.tempo !== undefined && !isNaN(GrooveDBTabIn.tempo)) myGrooveData.tempo = GrooveDBTabIn.tempo;
			if(GrooveDBTabIn.swingPercent !== undefined && !isNaN(GrooveDBTabIn.swingPercent)) myGrooveData.swingPercent = GrooveDBTabIn.swingPercent;
			if(GrooveDBTabIn.measures !== undefined && !isNaN(GrooveDBTabIn.measures)) myGrooveData.numberOfMeasures = GrooveDBTabIn.measures;
			if(GrooveDBTabIn.notesPerTabMeasure !== undefined && !isNaN(GrooveDBTabIn.notesPerTabMeasure)) myGrooveData.notesPerMeasure = GrooveDBTabIn.notesPerTabMeasure;
			if(GrooveDBTabIn.stickingTab !== undefined) myGrooveData.sticking_array = myGrooveUtils.noteArraysFromURLData("Stickings", GrooveDBTabIn.stickingTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			if(GrooveDBTabIn.hihatTab !== undefined) myGrooveData.hh_array = myGrooveUtils.noteArraysFromURLData("H", GrooveDBTabIn.hihatTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			myGrooveData.snare_array = myGrooveUtils.noteArraysFromURLData("S", combinedSnareTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			myGrooveData.kick_array = myGrooveUtils.noteArraysFromURLData("K", combinedKickTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			if(GrooveDBTabIn.tom1Tab !== undefined) myGrooveData.toms_array[0] = myGrooveUtils.noteArraysFromURLData("T1", GrooveDBTabIn.tom1Tab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			if(GrooveDBTabIn.tom4Tab !== undefined) myGrooveData.toms_array[3] = myGrooveUtils.noteArraysFromURLData("T4", GrooveDBTabIn.tom4Tab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);

			if(GrooveDBTabIn.timeSignature !== undefined) {
				var timeSig = parseTimeSignature(GrooveDBTabIn.timeSignature);
				myGrooveData.numBeats = timeSig[0];
				myGrooveData.noteValue = timeSig[1];
			}

			//console.log(myGrooveData);

			var svgTargetId = "svgTarget";
			var midiPlayerTargetId = "midiPlayerTarget";

			// spit out some HTML tags to hold the music and possibly the player
			document.getElementById(HtmlTagId).innerHTML = '' +
				'<div class="Printable"><div id="' + svgTargetId + '" class="svgTarget"  style="display:inline-block"></div></div>\n' +
				'<div class="nonPrintable"><div id="' + midiPlayerTargetId + '" ></div></div>\n';

			var svgTarget = document.getElementById(svgTargetId);
			var renderWidth = svgTarget.offsetWidth - 100;

			var abcNotation = myGrooveUtils.createABCFromGrooveData(myGrooveData, renderWidth);
			var svgReturn = myGrooveUtils.renderABCtoSVG(abcNotation);
			//console.log(abcNotation);

			svgTarget.innerHTML = svgReturn.svg;

			myGrooveUtils.setGrooveData(myGrooveData);

			myGrooveUtils.AddMidiPlayerToPage(midiPlayerTargetId, myGrooveData.notesPerMeasure, true);
			myGrooveUtils.expandOrRetractMIDI_playback(true, false); // make it small
			myGrooveUtils.setTempo(myGrooveData.tempo);
			myGrooveUtils.setSwing(myGrooveData.swingPercent);
			myGrooveUtils.oneTimeInitializeMidi();

		};

		// Add a groove to a page
		GrooveDBFormatPutGrooveOnPage(GrooveDBTabIn) {

			// add an html Element to hold the grooveDisplay
			var HTMLElementID = 'GrooveDisplay';
			document.write('<span id="' + HTMLElementID + '"></span>');

			window.addEventListener("load", function () {
				this.GrooveDBFormatPutGrooveInHTMLElement(HTMLElementID, GrooveDBTabIn);
			}, false);
		};
		
		
		

		AddGrooveDisplayToElementId(HtmlTagId, GrooveDefinition, showPlayer, linkToEditor, expandPlayer) {
			var myGrooveUtils = new GrooveUtils();
			var svgTargetId = "svgTarget";
			var midiPlayerTargetId = "midiPlayerTarget";

			document.getElementById(HtmlTagId).innerHTML = '' +
				'<div class="Printable"><div id="' + svgTargetId + '" class="svgTarget" style="display:inline-block"></div></div>\n' +
				'<div class="nonPrintable"><div id="' + midiPlayerTargetId + '"></div></div>\n';

			// load the groove from the URL data if it was passed in.
			var GrooveData = myGrooveUtils.getGrooveDataFromUrlString(GrooveDefinition);
			// console.log(GrooveData);

			var layoutFunction = function() {

				var svgTarget = document.getElementById(svgTargetId);
				// var renderWidth = svgTarget.offsetWidth;
				var renderWidth = 600;

				var abcNotation = myGrooveUtils.createABCFromGrooveData(GrooveData, renderWidth);
				// console.log(abcNotation);
				var svgReturn = myGrooveUtils.renderABCtoSVG(abcNotation);

				if (linkToEditor)
					svgTarget.innerHTML = '<a style="text-decoration: none" href="http://mikeslessons.com/gscribe/' + GrooveDefinition + '" target="_blank">' + svgReturn.svg + '</a>';
				else
					svgTarget.innerHTML = svgReturn.svg;
			};

			layoutFunction();

			// resize SVG on window resize (not needed now.   We render to 1000 and scale in css)
			//window.addEventListener("resize", layoutFunction);
			//window.addEventListener("beforeprint", layoutFunction);


			if (showPlayer) {
				myGrooveUtils.setGrooveData(GrooveData);
				//console.log(GrooveData);

				myGrooveUtils.AddMidiPlayerToPage(midiPlayerTargetId, GrooveData.notesPerMeasure, true);
				myGrooveUtils.expandOrRetractMIDI_playback(true, expandPlayer); // make it small
				myGrooveUtils.setTempo(GrooveData.tempo);
				myGrooveUtils.setSwing(GrooveData.swingPercent);
				myGrooveUtils.setMetronomeFrequencyDisplay(GrooveData.metronomeFrequency);
				myGrooveUtils.oneTimeInitializeMidi();
			}
		};
		
		
		
		AddGrooveDisplayToPage(URLEncodedGrooveData, showPlayer, linkToEditor, expandPlayer) {
			// add an html Element to hold the grooveDisplay
			var HTMLElementID = 'GrooveDisplay';
			var GrooveDisplayElement = document.createElement("div");
			GrooveDisplayElement.class = "GrooveDisplay";
			GrooveDisplayElement.id = HTMLElementID;
			
			
			//document.getElementsByTagName("body")[0].appendChild(GrooveDisplayElement);
			document.getElementById("gs").appendChild(GrooveDisplayElement);
			
			
			window.addEventListener("load", function () {
				this.AddGrooveDisplayToElementId(HTMLElementID, URLEncodedGrooveData, showPlayer, linkToEditor, expandPlayer);
			}, false);
		};

		
};




