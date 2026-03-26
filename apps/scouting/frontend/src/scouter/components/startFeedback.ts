/**
 * Plays start feedback: native haptics on Capacitor apps (iOS + Android),
 * otherwise vibration (Android) + short audio click (iOS + Android in browser).
 */
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

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
    if (Capacitor.isNativePlatform()) {
      void Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }
  } catch {
    /* not in Capacitor native app */
  }

  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(100);
    }
  } catch {
    /* ignore */
  }
  playClick();
}
