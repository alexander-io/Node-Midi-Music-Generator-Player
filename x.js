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
  }
]
// next, parse the options using commandLineArgs()
const options = commandLineArgs(optionDefinitions)
console.log('options :', options);

// command line arguments for nodejs are stored in process.argv
// console.log(process.argv);
  // or print with...
process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val)
})



/*
simple music playing/making script
use scribbletune and wildmidi to create then play midi files

first, declare a filename
*/

let filename = ''
options.filename ? filename = options.filename : filename = 'generic-music.mid'

filename.includes('.mid') ? {/* pass */} : filename = filename + '.mid'

console.log('filename :', filename);


// to get a list of all the modes and scales that scribbletune can generate, you can console log scribble.scales
// console.log('scribble scales :', scribble.scales);

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
  pattern: 'x-'.repeat(8)
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
