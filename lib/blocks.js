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
 * @fileoverview Blocks for teachers
 * 
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */

/**
 * A block providing an editable text instructions or hints
 */
Abbozza.Melody = {
  devtpe : "abbozzaMelody",
  init: function() {
    this.setHelpUrl(Abbozza.HELP_URL);
    this.setColour(ColorMgr.getCatColor("cat.SOUND"));
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("melody.png",16,16))
      .appendField(__("melody.MELODY",0))
      .appendField(new FieldDevNameInput("<default>", Abbozza.blockDevices, this), "NAME");
    this.appendStatementInput("NOTES")
      .setCheck("MELODY_NOTE");
    this.setOutput(false);
    this.setTooltip('');
    // this.setCommentText("");
    this.setPreviousStatement(false);
    this.setNextStatement(false);
  },
  
  generateCode : function(generator) {
  	return "";
  }
};

Abbozza.MelodyDuration = null;

Abbozza.MelodyNote = {
    init: function () {
        if (Abbozza.DeviceSpeakerOctaves == null ) {
            Abbozza.DeviceSpeakerOctaves = [
                [_("dev.OCTAVE_CONTRA"),"1"],
                [_("dev.OCTAVE_GREAT"),"2"],
                [_("dev.OCTAVE_SMALL"),"3"],
                [_("dev.OCTAVE_ONE_LINE"),"4"],
                [_("dev.OCTAVE_TWO_LINE"),"5"],
                [_("dev.OCTAVE_THREE_LINE"),"6"],
                [_("dev.OCTAVE_FOUR_LINE"),"7"]
            ];        
        }
        if ( Abbozza.MelodyDuration == null ) {
            Abbozza.MelodyDuration = [
                [_("melody.FULL"),32],
                [_("melody.HALF"),16],
                [_("melody.QUARTER"),8],
                [_("melody.EIGTH"),4],
                [_("melody.SIXTEENTH"),2],
                [_("melody.THIRTYSECOND"),1]
            ];        
        }

        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.SOUND"));
        this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(Abbozza.DeviceSpeakerNotes),"NOTE")
                .appendField(new Blockly.FieldDropdown(Abbozza.DeviceSpeakerOctaves),"OCTAVE")
                .appendField(new Blockly.FieldDropdown(Abbozza.MelodyDuration),"DURATION")
                .appendField("Triole")
                .appendField(new Blockly.FieldCheckbox(false),"TRIOLE")
                .appendField("Staccato")
                .appendField(new Blockly.FieldCheckbox(false),"STACCATO");
        this.setInputsInline(false);
        this.setPreviousStatement(true, "MELODY_NOTE");
        this.setNextStatement(true, "MELODY_NOTE");
        this.setTooltip('');
    },
    generateCode: function (generator) {
        return "";
    },
    setValues: function(note,octave,dur,tri,art) {
       this.getField("NOTE").setValue(note);
       this.getField("OCTAVE").setValue(octave);
       this.getField("DURATION").setValue(dur);
       if ( tri == 1 ) {
           this.getField("TRIOLE").state_ = true;
       }
       if ( art == 1 ) {
           this.getField("STACCATO").state_ = true;
       }
    }
};


Abbozza.MelodyPause = {
    init: function () {
        if ( Abbozza.MelodyDuration == null ) {
            Abbozza.MelodyDuration = [
                [_("melody.FULL"),"32"],
                [_("melody.HALF"),"16"],
                [_("melody.QUARTER"),"8"],
                [_("melody.EIGTH"),"4"],
                [_("melody.SIXTEENTH"),"2"],
                [_("melody.THIRTYSECOND"),"1"]
            ];        
        }
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.SOUND"));
        this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(Abbozza.MelodyDuration),"DURATION")
                .appendField(_("melody.PAUSE"));
        this.setInputsInline(false);
        this.setPreviousStatement(true, "MELODY_NOTE");
        this.setNextStatement(true, "MELODY_NOTE");
        this.setTooltip('');
    },
    generateCode: function (generator) {
        return "";
    },
    setValues: function(dur) {
       this.getField("DURATION").setValue(dur);
    }
};


Blockly.Blocks['melody'] = Abbozza.Melody;
Blockly.Blocks['melody_note'] = Abbozza.MelodyNote;
Blockly.Blocks['melody_pause'] = Abbozza.MelodyPause;

