/**
 * Browser feedback when a stopwatch cycle starts.
 * Uses vibration when available and always attempts a short click sound.
 */

type AudioContextedWindow = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

const VIBRATE_PULSE_MS = 120;
const VIBRATE_PAUSE_MS = 40;

const CLICK_FREQUENCY_HZ = 520;
const CLICK_GAIN_PEAK = 0.12;
const CLICK_GAIN_FLOOR = 0.001;
const CLICK_DURATION_S = 0.04;

const getAudioContext = (() => {
  let ctx: AudioContext | null = null;
  return (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const audioWindow = window as AudioContextedWindow;
    const Ctx = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
    if (!Ctx) return null;
    if (!ctx) {
      ctx = new Ctx();
    }
    return ctx;
  };
})();

const playTouchSound = (
  osc: OscillatorNode,
  gain: GainNode,
  ctx: AudioContext,
) => {
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = CLICK_FREQUENCY_HZ;
  osc.type = "sine";
  gain.gain.setValueAtTime(CLICK_GAIN_PEAK, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    CLICK_GAIN_FLOOR,
    ctx.currentTime + CLICK_DURATION_S,
  );
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + CLICK_DURATION_S);
};

const playClick = (): void => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const play = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      playTouchSound(osc, gain, ctx);
    };
    if (ctx.state !== "suspended") {
      play();
      return;
    }
    ctx.resume().then(play);
  } catch {
    /* ignore */
  }
};

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
