/**
 * @license
 * abbozza!
 *
 * Copyright 2015 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The tool provided by the melody plugin.
 * 
 */

MelodyPlugin = {}

/**
 * The operation called if the tool is cicked.
 * 
 * @returns {undefined}
 */
MelodyPlugin.toolHandler = function (status, response) {
    if (status == 200) {
        // Legal response

        // Extract voice "calliope" from response
        var spos = response.indexOf("calliope = {");
        spos = spos + 12;
        var epos = response.indexOf("} % calliope");
        var melody = response.slice(spos, epos).trim();
        MelodyPlugin.parseMelody(melody);
    } else if (status = 202) {
        // No Content
    } else {
        // IO Error
    }
}

// MelodyPlugin.notes = ["B","C","CS","D","DS","E","F","F","FS","G","GS","A","AS","B","C"7 ];

MelodyPlugin.parseMelody = function (melody) {
    melody = melody.replace(/[ \t\n]/g, "");
    console.log(melody);

    var pos = 0;

    var note;
    var acc = 0;
    var octave = 0;
    var punct = 0;
    var dur = 1;
    var stac = 0;
    var tri = 0;
    var lastBlock = null;

    while (pos < melody.length) {
        if (melody.charAt(pos) == '\\') {
            // if a command is read
            if (melody.substring(pos, pos + 11) == "\\tuplet3/2{") {
                tri = 1;
            }
            pos = pos + 11;
            note = "";
        } else if (melody.charAt(pos) == '}') {
            tri = 0;
            pos++;
            note = "";
        } else if (melody.charAt(pos) == 'r') {
            // pause
            note = "r";
            pos++;

            // check duration
            dur = 0;
            while ((melody.charAt(pos) >= '0') && (melody.charAt(pos) <= '9')) {
                dur = dur * 10 + melody.charCodeAt(pos) - 48;
                pos++;
            }
        } else {
            // read a note
            note = melody.charAt(pos);
            pos++;

            // check accidental
            acc = 0;
            if ((melody.charAt(pos) == "i") && (melody.charAt(pos + 1) == "s")) {
                pos = pos + 2;
                acc = +1;
            }
            if ((melody.charAt(pos) == "e") && (melody.charAt(pos + 1) == "s")) {
                pos = pos + 2;
                acc = -1;
            }

            // Check octave
            octave = 0;
            while (melody.charAt(pos) == '\'') {
                pos++;
                octave++;
            }
            while (melody.charAt(pos) == ',') {
                pos++;
                octave--;
            }

            // check duration
            dur = 0;
            while ((melody.charAt(pos) >= '0') && (melody.charAt(pos) <= '9')) {
                dur = dur * 10 + melody.charCodeAt(pos) - 48;
                pos++;
            }
            if (dur == 0)
                dur = 1;

            // check punctuation
            punct = 0;
            if (melody.charAt(pos) == '.') {
                punct = 1;
                pos++;
            }

            // check accentuation
            stac = 0;
            if (melody.charAt(pos) == '-') {
                pos++;
                if (melody.charAt(pos) == '.') {
                    stac = 1;
                    pos++;
                }
            }
        }

        octave = (octave + 3);

        var noten = -2;
        
        if (note == "c") {
            if (acc == 1) {
                noten = 1;
            } else if (acc == -1) {
                noten = 11;
                octave--;
            } else {
                noten = 0;
            }
        } else if (note == "d") {
            if (acc == 1) {
                noten = 3;
            } else if (acc == -1) {
                noten = 1;
            } else {
                noten = 2;
            }
        } else if (note == "e") {
            if (acc == 1) {
                noten = 5;
            } else if (acc == -1) {
                noten = 3;
            } else {
                noten = 4;
            }
        } else if (note == "f") {
            if (acc == 1) {
                noten = 5;
            } else if (acc == -1) {
                noten = 4;
            } else {
                noten = 5;
            }
        } else if (note == "g") {
            if (acc == 1) {
                noten = 8;
            } else if (acc == -1) {
                noten = 6;
            } else {
                noten = 7;
            }
        } else if (note == "a") {
            if (acc == 1) {
                noten = 10;
            } else if (acc == -1) {
                noten = 8;
            } else {
                noten = 9;
            }
        } else if ((note == "h") || (note == "b")) {
            if (acc == 1) {
                noten = 0;
                octave++;
            } else if (acc == -1) {
                noten = 10;
            } else {
                noten = 11;
            }
        } else if (note == "r") {
            noten = -1;
        }

        octave = "" + octave;
        dur = 32 / dur;

        // console.log( noten + " dur: " + dur + " acc: " + acc + " oct: " + octave + " punct: " + punct + " stac: " + stac + " tri: " + tri);

        if (noten >= -1) {
            var block;
            if (noten < 0) {
                block = Blockly.mainWorkspace.newBlock("melody_pause");
                block.setValues(dur);
            } else {
                block = Blockly.mainWorkspace.newBlock("melody_note");
                block.setValues(noten, octave, dur, tri, stac);
            }

            // console.log(block);

            if (lastBlock != null) {
                lastBlock.nextConnection.connect(block.previousConnection);
            } else {
                var melodyBlock = Blockly.mainWorkspace.newBlock("melody");
                melodyBlock.getInput("NOTES").connection.connect(block.previousConnection);
                melodyBlock.initSvg();
                melodyBlock.render();
            }
            block.initSvg();
            block.render();
            lastBlock = block;
        }

    }
}


// Register the tool handler.
Abbozza.registerPluginTool("abbozzaMelody", "gui.melodyplugin_tool", "melody.png", MelodyPlugin.toolHandler);

