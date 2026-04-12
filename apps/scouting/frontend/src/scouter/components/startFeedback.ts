/**
 * Browser feedback when a stopwatch cycle starts.
 * Uses vibration when available and always attempts a short click sound.
 */

type AudioContextedWindow = Window & { webkitAudioContext?: typeof AudioContext };

const VIBRATE_PULSE_MS = 120;
const VIBRATE_PAUSE_MS = 40;

let audioContext: AudioContext | null = null;

const playTouchSound = (osc: OscillatorNode, gain: GainNode) => {
  osc.connect(gain);
  gain.connect(audioContext!.destination);
  osc.frequency.value = 520;
  osc.type = "sine";
  gain.gain.setValueAtTime(0.12, audioContext!.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext!.currentTime + 0.04);
  osc.start(audioContext!.currentTime);
  osc.stop(audioContext!.currentTime + 0.04);
};

function playClick(): void {
  try {
    if (typeof window === "undefined") return;
    const audioWindow = window as AudioContextedWindow;
    const Ctx = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
    if (!Ctx) return;
    if (!audioContext) {
      audioContext = new Ctx();
    }
    const play = () => {
      const osc = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      playTouchSound(osc, gain);
    };
    if (audioContext.state !== "suspended") {
      play();
      return;
    }
    audioContext.resume().then(play);
  } catch {
    /* ignore */
  }
}

export function playStartFeedback(): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate([VIBRATE_PULSE_MS, VIBRATE_PAUSE_MS, VIBRATE_PULSE_MS]);
    }
  } catch {
    /* ignore */
  }
  playClick();
}
