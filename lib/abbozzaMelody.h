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


#define Pitch.C     0x0000
#define Pitch.CS    0x0001
#define Pitch.D     0x0002
#define Pitch.DS    0x0003
#define Pitch.E     0x0004
#define Pitch.ES    0x0005
#define Pitch.F     0x0006
#define Pitch.G     0x0007
#define Pitch.GS    0x0008
#define Pitch.A     0x0009
#define Pitch.AS    0x000A
#define Pitch.B     0x000B
#define Pitch.Pause 0x000F

#define Octave.Contra   0x0010
#define Octave.Great    0x0020
#define Octave.Small    0x0030
#define Octave.One      0x0040
#define Octave.Two      0x0050
#define Octave.Three    0x0060
#define Octave.Four     0x0070

#define Staccato 0x4000
#define Triole   0x8000


#endif
