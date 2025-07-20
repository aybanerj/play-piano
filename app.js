let audioContext;
let currentOscillator = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Note frequencies (in Hz)
const noteFrequencies = {
    'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
    'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
    'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
    'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
    'F#5': 739.99, 'G5': 783.99
};

// Piano layout: white keys and black key positions
const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeyPositions = [1, 2, 4, 5, 6]; // Positions after C, D, F, G, A
const octaves = [2, 3, 4, 5];

function generatePiano() {
    const piano = document.getElementById('piano');
    let keyIndex = 0;
    
    octaves.forEach(octave => {
        whiteKeys.forEach((note, index) => {
                    // Create white key
                    const whiteKey = document.createElement('div');
                    whiteKey.className = 'key white-key';
                    whiteKey.dataset.note = `${note}${octave}`;
                    
                    const label = document.createElement('div');
                    label.className = 'note-label';
                    label.textContent = `${note}${octave}`;
                    whiteKey.appendChild(label);
                    
                    piano.appendChild(whiteKey);
                    
                    // Add black key if needed
                    if (blackKeyPositions.includes(index)) {
                        const blackKey = document.createElement('div');
                        blackKey.className = 'key black-key';
                        blackKey.dataset.note = `${note}b${octave}`;
                        blackKey.style.left = `${(keyIndex * 46)+65}px`;
                        
                        const blackLabel = document.createElement('div');
                        blackLabel.className = 'note-label';
                        blackLabel.textContent = `${note}b${octave}`;
                        blackLabel.style.color = '#ccc';
                        blackKey.appendChild(blackLabel);
                        piano.appendChild(blackKey);
                    }
                    keyIndex++;
                });
            });

            // Add event listeners
            document.querySelectorAll('.key').forEach(key => {
                key.addEventListener('mouseenter', handleKeyHover);
                key.addEventListener('mouseleave', handleKeyLeave);
                key.addEventListener('click', handleKeyClick);
            });
        }

        function handleKeyHover(event) {
            initAudio();
            const note = event.target.dataset.note;
            showNoteOnStaff(note);
            document.getElementById('currentNote').textContent = note;
            playNote(note);
        }

        function handleKeyLeave(event) {
            hideAllNotes();
            document.getElementById('currentNote').textContent = 'Hover over a key';
            stopNote();
        }

        function handleKeyClick(event) {
            event.target.classList.add('active');
            setTimeout(() => {
                event.target.classList.remove('active');
            }, 200);
        }

        function showNoteOnStaff(note) {
            hideAllNotes();
            
            // Determine which clef and position
            const noteElement = getNoteElement(note);
            if (noteElement) {
                noteElement.classList.add('visible');
            }
        }

        function hideAllNotes() {
            document.querySelectorAll('.note').forEach(note => {
                note.classList.remove('visible');
            });
        }

        function getNoteElement(note) {
            // Remove sharp/flat for element ID
            const baseNote = note.replace('#', '').replace('b', '');
                    
            // Determine clef based on octave
            const octave = parseInt(baseNote.slice(-1));
            const noteName = baseNote.slice(0, -1);

            if (octave <= 3) {
                return document.getElementById(`bass-${baseNote}`);
            } else {
                return document.getElementById(`treble-${baseNote}`);
            }
        }

        function playNote(note) {
            if (!audioContext || !noteFrequencies[note]) return;
            stopNote(); // Stop any currently playing note
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(noteFrequencies[note], audioContext.currentTime);
            oscillator.type = 'triangle'; // Softer sound than 'square' or 'sawtooth'
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
            
            currentOscillator = oscillator;
        }

        function stopNote() {
            if (currentOscillator) {
                try {
                    currentOscillator.stop();
                } catch (e) {
                    // Oscillator already stopped
                }
                currentOscillator = null;
            }
        }

        generatePiano();