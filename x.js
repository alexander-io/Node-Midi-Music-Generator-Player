/*
 * usage :
 *
 * $ node x [--filename lofi.mid] [--pattern x---] [--repeat 8] [--help]
 *
 * $ node x --filename lofi_beats.mid
 *
 * $ node x --pattern x--- 4
 * will result : pattern = 'x---'.repeat(4)
 * x---x---x---x---
 *
 * $ node x --pattern x--- 8
 * will result : pattern = '--x-'.repeat(8)
 * --x---x---x---x---x---x---x---x-
 *
 */

const scribble = require('scribbletune')
const { spawnSync } = require('child_process')
const commandLineArgs = require('command-line-args')

// describe the command line options
const optionDefinitions = [
  {
    name : 'filename',
    alias : 'f',
    type : String,
    multiple : false,
    defaultOption : true
  },
  {
    name : 'pattern',
    alias : 'p',
    type : String,
    multiple : true,
    defaultOption : false
  },
  {
    name : 'repeat',
    alias : 'r',
    type : Number,
    multiple : false
  },
  {
    name : 'help',
    alias : 'h',
    type : Boolean
  }
]
// next, parse the options using commandLineArgs()
const options = commandLineArgs(optionDefinitions)

// XXX test print
console.log('options :', options);

if (options.help) {
  console.log('Node-Midi-Music-Generator-Player Manual\n\tUsage :\n\t\t$ node x [--filename lofi.mid] [--pattern=x---] [--repeat 8] [--help]\n\t\t$ node x [--filename <String>] [--pattern=<String>] [--repeat <Integer>] [--help]\n\n\t\t$ node x --filename lofi_beats.mid\n\n\t\t$ node x --pattern=x--- 4\n\t\t$ node x --pattern=x--- --repeat 4\n\t\t\t// result : pattern = \'x---\'.repeat(4), x---x---x---x---\n\n\t\t$ node x --pattern=--x- 8\n\t\t$ node x --pattern=--x- --repeat 8\n\t\t\t// result : pattern = \'--x-\'.repeat(8), --x---x---x---x---x---x---x---x-')
  // return, do nothing
  process.exit(0)
}

/*
simple music playing/making script
use scribbletune and wildmidi to create then play midi files

first, declare a filename, pattern, repeat val
*/
let filename = 'generic-music.mid', pattern = '-x--', repeat = 4

// is there a filename provided in the command line options? if yes, assign filename to it, otherwise assign the default filename : 'generic-music.mid'
options.filename ? filename = options.filename : filename = 'generic-music.mid'

// does the file have the '.mid' entension? if no append it
filename.includes('.mid') ? {/* pass */} : filename = filename + '.mid'

// was there a pattern provided?
// options.pattern ? {function(){
//   console.log('found a pattern');
//   pattern = options.pattern[0]
//   // XXX test print
//   console.log('pattern :', pattern);
//   options.pattern[1] ? repeat = options.pattern[1] : {/* pass */}
// }} : function(){
//   // set default pattern
//   pattern = '-x--'
// }

// see if pattern contains x, -, or _
let pattern_is_properly_formatted = (p) => {
    return (p.includes('x') || p.includes('-') || p.includes('_'))
}
// if user provided a pattern as a command line argument, and it's properly formatted with ('x','-','_')...
if (
  options.pattern && pattern_is_properly_formatted(options.pattern[0])
) /* then set pattern -> command line arg */ {
  pattern = options.pattern[0]
  options.pattern[1] ? repeat = options.pattern[1] : {/* pass */}
}

// XXX test print
console.log('filename', filename);
console.log('pattern', pattern);
console.log('repeat', repeat);

// XXX test print
// console.log('filename :', filename);

// to get a list of all the modes and scales that scribbletune can generate, you can console log scribble.scales
// console.log('scribble scales :', scribble.scales); // XXX test print

// get a list of all the chords that scribbletune can generate, console log scribble.listChords()
// console.log('scribble chords :', scribble.listChords());

/*
 * ScribbleTube notes
 *
 * Chords, you can add chords to the notes array while creating a clip to render chords. either provide the notes (with octave) of the chords you want separated by commas or use Scribbletube's chord generator
 *
 */
// let chords = scribble.clip({
//   notes : ['F#min', 'C#min', 'Dmaj', 'Bmin', 'Emaj', 'Amaj', 'Dmaj', 'C#min', 'Amaj'],
//   pattern : 'x_x_x_--'.repeat(8),
//   sizzle : true
// })



/* try to create a clip of the c major scale */
let clip = scribble.clip({
  notes: scribble.scale('c', 'blues', 3), // this works too ['c3', 'd3', 'e3', 'f3', 'g3', 'a3', 'b3']
  pattern: pattern.repeat(repeat)
});

// next, declare a promise to create a midi file before attempting to play the file
let make_midi = new Promise(function(resolve, reject) {

  try {
    // try to write the clip to the file system, then resolve
    scribble.midi(clip, filename)
    resolve()
  } catch(e) {
    reject(e)
  }
})

// after the midi file has been made...
make_midi.then(function(resolve, reject) {

  if(reject){
    console.log(reject);
  }

  // spawn a child process to execute 'wildmidi' (an audio player for midi files), on the file to play the sound
  const wildmidi = spawnSync('wildmidi', [filename]);

})
