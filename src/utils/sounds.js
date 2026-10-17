const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playTone(freq, type, duration, when = 0) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + when);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime + when);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + when + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime + when);
  osc.stop(audioCtx.currentTime + when + duration);
}

export function playSuccess() {
  playTone(523.25, 'sine', 0.15, 0);   // Do
  playTone(659.25, 'sine', 0.15, 0.1);  // Mi
  playTone(783.99, 'sine', 0.3, 0.2);   // So
}

export function playError() {
  playTone(349.23, 'sine', 0.2, 0);   // Fa
  playTone(293.66, 'sine', 0.3, 0.15); // Re
}

export function playClick() {
  playTone(800, 'square', 0.05, 0);
}

export function playCelebration() {
  for (let i = 0; i < 5; i++) {
    playTone(400 + i * 100, 'sine', 0.1, i * 0.08);
  }
  playTone(800, 'sine', 0.5, 0.4);
}

export function playLevelUp() {
  playTone(523.25, 'sine', 0.12, 0);
  playTone(659.25, 'sine', 0.12, 0.1);
  playTone(783.99, 'sine', 0.12, 0.2);
  playTone(1046.5, 'sine', 0.35, 0.3);
}

export function playBadge() {
  playTone(659.25, 'triangle', 0.15, 0);
  playTone(880, 'triangle', 0.15, 0.12);
  playTone(1108.73, 'triangle', 0.3, 0.24);
}

export function playSad() {
  playTone(392, 'sine', 0.3, 0);
  playTone(349.23, 'sine', 0.3, 0.2);
  playTone(311.13, 'sine', 0.45, 0.4);
}

export function playStep() {
  playTone(440, 'square', 0.06, 0);
}