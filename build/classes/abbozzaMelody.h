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

#ifndef _ABZ_MELODY_H
#define _ABZ_MELODY_H

#include "MicroBit.h"

#define PitchC     0x0000
#define PitchCS    0x0001
#define PitchD     0x0002
#define PitchDS    0x0003
#define PitchE     0x0004
#define PitchES    0x0005
#define PitchF     0x0006
#define PitchG     0x0007
#define PitchGS    0x0008
#define PitchA     0x0009
#define PitchAS    0x000A
#define PitchB     0x000B
#define PitchPause 0x000F

#define OctaveContra   0x0010
#define OctaveGreat    0x0020
#define OctaveSmall    0x0030
#define OctaveOne      0x0040
#define OctaveTwo      0x0050
#define OctaveThree    0x0060
#define OctaveFour     0x0070

#define Staccato 0x4000
#define Triole   0x8000

class AbbozzaMelody {

private:
    const uint8_t *_data;
    int cur_note;
    int cur_pitch;
    int cur_octave;
    int cur_duration;
    int cur_staccato;
    int cur_triole;
    
public:
    AbbozzaMelody(const uint8_t *data);
    
    void setNote(int no);
    
    uint8_t getPitch();
    uint8_t getOctave();
    uint8_t getDuration();
    bool getStaccato();
    bool getTriole();
    
};

#endif
