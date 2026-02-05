// בס"ד
const NORMALIZED_MIN = 0;
const NORMALIZED_MAX = 1;
const BYTE_ZERO = 0;
const BYTE_MAX = 255;
const CHANNEL_STRIDE = 4;
const CHANNEL_RED = 0;
const CHANNEL_GREEN = 1;
const CHANNEL_BLUE = 2;
const CHANNEL_ALPHA = 3;
const RAMP_INDEX_STEP = 1;
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
  { stop: 0, color: { red: 0, green: 0, blue: 255 } },
  { stop: 0.2, color: { red: 0, green: 128, blue: 255 } },
  { stop: 0.4, color: { red: 0, green: 255, blue: 255 } },
  { stop: 0.6, color: { red: 0, green: 255, blue: 0 }},
  { stop: 0.8, color: { red: 255, green: 255, blue: 0 } },
  { stop: 1, color: { red: 255, green: 0, blue: 0 } },
];

// Linearly interpolate between two numbers (t in [0,1]).
const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

// Linearly interpolate each RGB channel.
const lerpColor = (start: ColorRGB, end: ColorRGB, t: number): ColorRGB => ({
  red: Math.round(lerp(start.red, end.red, t)),
  green: Math.round(lerp(start.green, end.green, t)),
  blue: Math.round(lerp(start.blue, end.blue, t)),
});

// Map a normalized intensity value into a ramp color.
const getRampColor = (value: number): ColorRGB => {
  const normalized = Math.min(
    NORMALIZED_MAX,
    Math.max(
      NORMALIZED_MIN,
      (value - NORMALIZED_MIN) / (NORMALIZED_MAX - NORMALIZED_MIN || NORMALIZED_MAX),
    ),
  );
  const lastIndex = COLOR_RAMP.length - RAMP_INDEX_STEP;
  const [first = { stop: NORMALIZED_MIN, color: { red: BYTE_ZERO, green: BYTE_ZERO, blue: BYTE_ZERO } }] =
    COLOR_RAMP;
  if (normalized <= first.stop) {
    return first.color;
  }
  const fallback = COLOR_RAMP[lastIndex]?.color ?? first.color;
  const match = { value: fallback };
  const found = { value: false };
  COLOR_RAMP.slice(RAMP_INDEX_STEP).forEach((end, index) => {
    if (found.value) {
      return;
    }
    const start = COLOR_RAMP[index];
    if (normalized <= end.stop) {
      const range = end.stop - start.stop || NORMALIZED_MAX;
      const time = (normalized - start.stop) / range;
      match.value = lerpColor(start.color, end.color, time);
      found.value = true;
    }
  });
  return match.value;
};

// Convert alpha-only heatmap data into an RGB ramp with boosted intensity.
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
