/**
 * Browser feedback when a stopwatch cycle starts.
 * Uses vibration when available and always attempts a short click sound.
 */
let audioContext: AudioContext | null = null;

function playClick(): void {
  try {
    const Ctx =
      typeof window !== "undefined" &&
      (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext);
    if (!Ctx) return;
    if (!audioContext) {
      audioContext = new Ctx();
    }
    const ctx = audioContext;
    const play = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 520;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    };
    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(play)
        .catch(() => {});
    } else {
      play();
    }
  } catch {
    /* ignore */
  }
}

export function playStartFeedback(): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate([120, 40, 120]);
    }
  } catch {
    /* ignore */
  }
  playClick();
}
