/**
 * @license
 * abbozza! Calliope plugin for the MH-Z16 CO2 sensor
 * 
 * The sensor has to be connected to a serial connection with 9600 baud.
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

#include "MicroBit.h"
#include "abbozzaMelody.h"

AbbozzaMelody::AbbozzaMelody(const uint8_t *data) {
    this->_data = data;
    this->cur_note = 0;
}

/**
 * Set the number of the current note in the melody.
 * 
 * @param no
 */

void AbbozzaMelody::setNote(int no) {
    this->cur_note = no % ( sizeof(_data)/2 - 1);
    while ( cur_note < 0 ) cur_note = cur_note + sizeof(_data)/2 - 1;
   
    uint8_t first = this->_data[2 + 2* this->cur_note];
    uint8_t second = this->_data[3 + 2* this->cur_note];
    
    cur_pitch = first % 0x0010;
    cur_octave = first / 0x0010;
    
    cur_duration = second & 0x0FFF;
    cur_staccato = second & 0x4000;
    cur_triole = second & 0x8000;
}

/**
 * Return the frequency of the current note.
 * 
 * @return The frequency in Hz of the current note.
 */
int AbbozzaMelody::getFrequency() {
    int pitch = getPitch();
    int octave = getOctave();
    
    int freqIdx = octave * 12 + pitch;
    
    return AbbozzaFrequencies[freqIdx];
    
}

/**
 * Return the duration of the current note in ms.
 * 
 * @return The duration of the current note in ms.
 */
int AbbozzaMelody::getDuration() {
    int dur = speed * cur_duration / 32;
    if ( cur_triole ) {
        dur = dur * 2 / 3;
    }
    return dur;
}


uint8_t AbbozzaMelody::getPitch() {
    return cur_pitch;
}


uint8_t AbbozzaMelody::getOctave() {
    return cur_octave;
}


bool AbbozzaMelody::getStaccato() {
    return (cur_staccato > 0);
}


bool AbbozzaMelody::getTriole() {
    return (cur_triole > 0);
}
