# abbozza-Melody-calliopeC

abbozza! Melody is a plugin for [abbozza! calliopeC](abbozza-calliope), providing a datastructure for the storage
and handling of melodies. In addition to a series of blocks for the definition of a melody and
the access to the single notes, it provides a tool for reading a melody from a
[LilyPond](http://lilypond.org) file.

## The LilyPond Format

The abbozza! Melody tool can read a melody from a LilyPond File. But there are some restrictions.

The following file can be used as a template. It defines one voice called *calliope*, which is read by the
tool. The file can also be set using tools like [Frescobaldi](http://http://frescobaldi.org/) or 
[LilyBin](http://lilybin.com).

```
\version "2.18.2"

calliope = {
  r1 cis''4 ees'4 r1 c,2 b1-. \tuplet 3/2 { d'4 c'1-. d'4 } c'1 c'32 c'32 c' d' e'
}

\score {
  \new Voice = "calliope" { \voiceOne \calliope }
}
```
The voice has to be given in C major.

### The Notes and Pauses

The voice consists of a sequence of entries, each describing either a note or a pause.

The entry of a note is of the following form: `<pitch><duration>[-.]`

The pitch of a note is secified by a the lowercase letters a through g. The note names c to b indicate the 
octave below middle C. Accidentals are given by appended `ìs` and `es`, increasing or decreasing the pitch by a half tone.
For example `cis` is a ♯C while `ges` is a ♭G.

An entry of pitch `r` is a pause.

To lower or raise the octave either an number of `'` or `,` is appended, each increasing or decreasing the octave.
For example the concert pitch A is given by `a'`, ie. the A pitch from thh one-accented octave. The Middle C is
described by `c'` while the Bass C is `c` without an accent and the Low C is `c,`

Durations are designated by numbers. They are entered as their reciprocal values. For example, a quarter note is entered using a 4 (since it is a 1/4 note), and a half note is entered using a 2 (since it is a 1/2 note).
`c1` is the Bass C of full (1/1) length, while `d4` is a quarter (1/4) note of pitch `d`. abbozza! Melody knows the
lengths 1, 2, 4, 8, 16 and 32.

To indicate that a note should be played as staccato `-.` is appended to the entry.

A triole is described by grouping notes together using `\tuplet 3/2 { ... }`.

