// בס"ד
const NORMALIZED_MIN = 0;
const NORMALIZED_MAX = 1;
const COLOR_RAMP_OFFSET = 0;
const BYTE_ZERO = 0;
const BYTE_MAX = 255;
const CHANNEL_STRIDE = 4;
const CHANNEL_RED = 0;
const CHANNEL_GREEN = 1;
const CHANNEL_BLUE = 2;
const CHANNEL_ALPHA = 3;
const COLOR_STOP_COOL = 0.2;
const COLOR_STOP_CYAN = 0.4;
const COLOR_STOP_GREEN = 0.6;
const COLOR_STOP_WARM = 0.8;
const RAMP_INDEX_STEP = 1;
const RAMP_LAST_OFFSET = 1;
interface ColorStop {
  stop: number;
  color: ColorRGB;
}

interface ColorRGB {
  red: number;
  green: number;
  blue: number;
}
const COLOR_RAMP: ColorStop[] = [
  { stop: NORMALIZED_MIN, color: { red: 0, green: 0, blue: 128 } },
  { stop: COLOR_STOP_COOL, color: { red: 0, green: 64, blue: 255 } },
  { stop: COLOR_STOP_CYAN, color: { red: 0, green: 255, blue: 255 } },
  { stop: COLOR_STOP_GREEN, color: { red: 0, green: 255, blue: 0 }},
  { stop: COLOR_STOP_WARM, color: { red: 255, green: 255, blue: 0 } },
  { stop: NORMALIZED_MAX, color: { red: 255, green: 0, blue: 0 } },
];

const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

const lerpColor = (start: ColorRGB, end: ColorRGB, t: number): ColorRGB => ({
  red: Math.round(lerp(start.red, end.red, t)),
  green: Math.round(lerp(start.green, end.green, t)),
  blue: Math.round(lerp(start.blue, end.blue, t)),
});

const getRampColor = (value: number): ColorRGB => {
  const clamped = Math.min(NORMALIZED_MAX, Math.max(NORMALIZED_MIN, value));
  const ramp = COLOR_RAMP.slice(COLOR_RAMP_OFFSET, -RAMP_LAST_OFFSET);
  const rampPairs = ramp.slice(COLOR_RAMP_OFFSET, -RAMP_INDEX_STEP);
  
  const fallback = ramp[ramp.length - RAMP_LAST_OFFSET].color;
  const result = { value: fallback };
  const found = { value: false };
  
  rampPairs.forEach((start, index) => {
    if (found.value) {
      return;
    }
    const end = ramp[index + RAMP_INDEX_STEP];
    if (clamped < start.stop || clamped > end.stop) {
      return;
    }
      const range = end.stop - start.stop || NORMALIZED_MAX;
      const time = (clamped - start.stop) / range;
      result.value = lerpColor(start.color, end.color, time);
      found.value = true;
  });

  return result.value;
};

export const colorizeHeatmapImageData = (
  imageData: ImageData,
  intensityGain: number,
): void => {
  const { data } = imageData;
  data.forEach((notUsed, index) => {
    if (index % CHANNEL_STRIDE !== BYTE_ZERO) {
      return;
    }
    const alpha = data[index + CHANNEL_ALPHA];
    if (alpha === BYTE_ZERO) {
      return;
    }
    const intensity = Math.min(NORMALIZED_MAX, (alpha / BYTE_MAX) * intensityGain);
    const color = getRampColor(intensity);
    data[index + CHANNEL_RED] = color.red;
    data[index + CHANNEL_GREEN] = color.green;
    data[index + CHANNEL_BLUE] = color.blue;
    data[index + CHANNEL_ALPHA] = Math.round(BYTE_MAX * intensity);
  });
};
