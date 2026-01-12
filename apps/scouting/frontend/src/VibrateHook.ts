// בס"ד
import { useCallback, useMemo } from 'react';

/**
 * VibratePattern can be a single duration (ms) 
 * or an array of [vibrate, pause, vibrate, ...]
 */
type VibratePattern = number | number[];

export const useVibrate = () => {
  // Check if the browser/device supports the Vibration API
  const isSupported = useMemo(() => 
    typeof navigator !== 'undefined' && 'vibrate' in navigator, 
  []);

  /**
   * Triggers the vibration
   * @param pattern - Duration in ms or a pattern array
   */
  const vibrate = useCallback((pattern: VibratePattern = 2000) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    } else {
      console.warn("Vibration API is not supported on this device/browser.");
    }
  }, [isSupported]);

  /**
   * Stops any ongoing vibration
   */
  const stop = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  return { vibrate, stop, isSupported };
};