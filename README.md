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

The entry of a note is of the following form: `<pitch><octave><duration>[-.]`

`<pitch>`is the pitch of the note, i.e one of `c`,`d`,`e`,`f`,`g`,`a`,`b`. it might be increased by
a halfe note by appending `is` and decreased by a half note by `es`. For example `cis` is a ♯C while `ges`
is a ♭G.

`<octave>` is the octave of the note. If `<octave>` is empty the pitch in the small octave is used.
Adding a series of `'` or `,` increases or decreases the chosen octave. For example the concert pitch A
is given by `a'`, ie. the A pitch from thh one-accented octave. The Middle C is described by `c'` while
the Bass C is `c` without an accent and the Low C is `c,`

`<duration>` is the duration of the note described by the fraction. `c1` is the Bass C of full (1/1) length,
while `d4` is a quarter (1/4) note of pitch `d`. abbozza! Melody knows the lengths 1, 2, 4, 8, 16 and 32.

To indicate that a note should be played as staccato `-.` is appended to the entry.

A triole is described by grouping notes together using `\tuplet 3/2 { ... }`.
