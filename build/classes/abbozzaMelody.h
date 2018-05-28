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


int AbbozzaFrequencies[] = {
    33,     35,   27,   39,   41,   44,   46,   49,   52,   55,   58,   62, 
    65,     69,   73,   78,   82,   87,   93,   98,  104,  110,  117,  123,
    131,   139,  147,  156,  165,  175,  185,  196,  208,  220,  233,  247,
    262,   277,  294,  311,  330,  349,  370,  392,  415,  440,  466,  494,
    523,   554,  587,  622,  659,  698,  740,  784,  831,  880,  932,  988,
    1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976,
    2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951    
};

class AbbozzaMelody {

private:
    const uint8_t *_data;
    int speed;
    int cur_note;
    int cur_pitch;
    int cur_octave;
    int cur_duration;
    int cur_staccato;
    int cur_triole;
    
public:
    AbbozzaMelody(const uint8_t *data);
    
    void setNote(int no);
    void setSpeed(int speed);
    
    int getFrequency();
    int getDuration();
    
    uint8_t getPitch();
    uint8_t getOctave();
    bool getStaccato();
    bool getTriole();
    
};

#endif
