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
 * 
 * The binary data for a melody consists of an array with two subsequent bytes
 * encoding a note:
 * 1st byte: 
 *            bit 0 - 3 : pitch
 *            bit 4 - 6 : octave
 * 2nd byte:
 *            bit 0 - 5 : duration
 *            bit 6     : staccato
 *            bit 7     : triole
 */

Note = {};

Note.Pause = 15;
Note.C = 0;
Note.CS = 1;
Note.D = 2;
Note.DS = 3;
Note.E = 4;
Note.F = 5;
Note.FS = 6;
Note.G = 7;
Note.GS = 8;
Note.A = 9;
Note.AS = 10;
Note.B = 11;

Note.Staccato = 64;
Note.Triole = 128;

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
    this.setPreviousStatement(true, "DEVICE");
    this.setNextStatement(true, "DEVICE");
  },
  
  generateCode : function(generator) {
      generator.addLibrary("lib/abbozzaMelody.h");
      var name = generator.fieldToCode(this,"NAME");
      var data = generator.statementToCode(this, 'NOTES', "");
      data = data.replace(/\n/g,",");
      
      generator.addInitCode("const uint8_t __melody_" + name + "_data__[] __attribute__ ((aligned (4))) = { 0xff,0xff," + data + " };");
      generator.addInitCode("AbbozzaMelody __melody_" + name + "__(__melody_" + name + "_data__);");
      return "";
  }
};


Abbozza.MelodyDuration = null;

/**
 * @type typeA block for notes inside melodies
 * 
 */
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
        this.setOutput(false);
        this.setInputsInline(false);
        this.setPreviousStatement(true, "MELODY_NOTE");
        this.setNextStatement(true, "MELODY_NOTE");
        this.setTooltip('');
        this.setValues(0,4,32,false,false);
    },
    
    generateCode: function (generator) {
        var pitch = generator.fieldToCode(this,"NOTE");
        var octave = generator.fieldToCode(this,"OCTAVE");
        var duration = generator.fieldToCode(this,"DURATION");
        var triole = generator.fieldToCode(this,"TRIOLE");
        var staccato = generator.fieldToCode(this,"STACCATO");
                
        var first = parseInt(pitch) + 16 * parseInt(octave);
        var second = parseInt(duration);
        if (triole) {
           second = second + Note.Triole;
        }
        if (staccato) {
           second = second + Note.Staccato;
        }
        
        return first + "," + second;
    },
    
    setValues: function(note,octave,dur,tri,art) {
       this.getField("NOTE").setValue("" + note);
       this.getField("OCTAVE").setValue("" + octave);
       this.getField("DURATION").setValue("" + dur);
       if ( tri == 1 ) {
           this.getField("TRIOLE").state_ = true;
       }
       if ( art == 1 ) {
           this.getField("STACCATO").state_ = true;
       }
    }
};

/**
 * A block for pauses inside melodies.
 * 
 * @type type
 */
Abbozza.MelodyPause = {
    init: function () {
        if ( Abbozza.MelodyDuration == null ) {
            Abbozza.MelodyDuration = [
                [_("melody.FULL"),"32"],
                [_("melody.HALF"),"16"],
                [_("melody.QUARTER"),"8"],
                [_("melody.EIGHTH"),"4"],
                [_("melody.SIXTEENTH"),"2"],
                [_("melody.THIRTYSECOND"),"1"]
            ];        
        }
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.SOUND"));
        this.appendDummyInput()
                .appendField(_("melody.PAUSE"))
                .appendField(new Blockly.FieldDropdown(Abbozza.MelodyDuration),"DURATION");
        this.setOutput(false);
        this.setInputsInline(false);
        this.setPreviousStatement(true, "MELODY_NOTE");
        this.setNextStatement(true, "MELODY_NOTE");
        this.setTooltip('');
        this.setValues(32);
    },
    generateCode: function (generator) {
        var first = Note.Pause;
        var duration = generator.fieldToCode(this,"DURATION");
        var second = duration;
        
        return first + "," + second;
    },
    setValues: function (dur) {
       this.getField("DURATION").setValue("" + dur);
    }
};

/**
 * Setting the current note in a melody
 * 
 * @type type
 */
Abbozza.MelodySetNote = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.SOUND"));
        this.appendValueInput("NOTE")
            .appendField(new Blockly.FieldImage("melody.png",16,16))
            .appendField(new DeviceDropdown(this, "abbozzaMelody"), "NAME")
            .appendField(_("melody.SET_NOTE"))
            .setCheck("NUMBER");
        this.setInputsInline(false);
        this.setOutput(false);
        this.setPreviousStatement(true, "STATEMENT");
        this.setNextStatement(true, "STATEMENT");
        this.setTooltip('');
    },
    /*  setName : function(name) {
     this.name = name;
     },*/


    generateCode: function (generator) {
        var device = Abbozza.blockDevices.getDevice(generator.fieldToCode(this, "NAME"));
        var note = generator.valueToCode(this, "NOTE");

        if (device == null) {
            ErrorMgr.addError(this, "UNKNOWN_DEVICE");
            return;
        }

        var name = generator.fieldToCode(device,"NAME");
        return "__melody_" + name + "__.setNote(" + note + ");";
    }

};


/**
 * Get the frequency of the current note
 * 
 * @type type
 */
Abbozza.MelodyGetFreq = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.SOUND"));
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("melody.png",16,16))
            .appendField(new DeviceDropdown(this, "abbozzaMelody"), "NAME")
            .appendField(_("melody.GET_FREQ"));
        this.setInputsInline(false);
        this.setOutput(true,"NUMBER");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setTooltip('');
    },
    /*  setName : function(name) {
     this.name = name;
     },*/


    generateCode: function (generator) {
        var device = Abbozza.blockDevices.getDevice(generator.fieldToCode(this, "NAME"));
        var note = generator.valueToCode(this, "NOTE");

        if (device == null) {
            ErrorMgr.addError(this, "UNKNOWN_DEVICE");
            return;
        }

        var name = generator.fieldToCode(device,"NAME");
        return "__melody_" + name + "__.getFrequency()";
    }

};

/**
 * Get the duration of the current note
 * 
 * @type type
 */
Abbozza.MelodyGetDur = {
    init: function () {
        this.setHelpUrl(Abbozza.HELP_URL);
        this.setColour(ColorMgr.getColor("cat.SOUND"));
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("melody.png",16,16))
            .appendField(new DeviceDropdown(this, "abbozzaMelody"), "NAME")
            .appendField(_("melody.GET_DUR"));
        this.setInputsInline(false);
        this.setOutput(true,"NUMBER");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setTooltip('');
    },
    /*  setName : function(name) {
     this.name = name;
     },*/


    generateCode: function (generator) {
        var device = Abbozza.blockDevices.getDevice(generator.fieldToCode(this, "NAME"));
        var note = generator.valueToCode(this, "NOTE");

        if (device == null) {
            ErrorMgr.addError(this, "UNKNOWN_DEVICE");
            return;
        }

        var name = generator.fieldToCode(device,"NAME");
        return "__melody_" + name + "__.getDuration()";
    }

};


Blockly.Blocks['melody'] = Abbozza.Melody;
Blockly.Blocks['melody_note'] = Abbozza.MelodyNote;
Blockly.Blocks['melody_pause'] = Abbozza.MelodyPause;
Blockly.Blocks['melody_set_note'] = Abbozza.MelodySetNote;
Blockly.Blocks['melody_get_freq'] = Abbozza.MelodyGetFreq;
Blockly.Blocks['melody_get_dur'] = Abbozza.MelodyGetDur;

