// בס"ד
const NORMALIZED_MIN = 0;
const NORMALIZED_MAX = 1;
const BYTE_ZERO = 0;
const BYTE_LOW = 64;
const BYTE_MID = 128;
const BYTE_MAX = 255;
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
  color: [number, number, number];
}

const COLOR_BLUE_DARK: [number, number, number] = [BYTE_ZERO, BYTE_ZERO, BYTE_MID];
const COLOR_BLUE: [number, number, number] = [BYTE_ZERO, BYTE_LOW, BYTE_MAX];
const COLOR_CYAN: [number, number, number] = [BYTE_ZERO, BYTE_MAX, BYTE_MAX];
const COLOR_GREEN: [number, number, number] = [BYTE_ZERO, BYTE_MAX, BYTE_ZERO];
const COLOR_YELLOW: [number, number, number] = [BYTE_MAX, BYTE_MAX, BYTE_ZERO];
const COLOR_RED: [number, number, number] = [BYTE_MAX, BYTE_ZERO, BYTE_ZERO];

const COLOR_RAMP: ColorStop[] = [
  { stop: NORMALIZED_MIN, color: COLOR_BLUE_DARK },
  { stop: COLOR_STOP_COOL, color: COLOR_BLUE },
  { stop: COLOR_STOP_CYAN, color: COLOR_CYAN },
  { stop: COLOR_STOP_GREEN, color: COLOR_GREEN },
  { stop: COLOR_STOP_WARM, color: COLOR_YELLOW },
  { stop: NORMALIZED_MAX, color: COLOR_RED },
];

const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

const getRampColor = (value: number): [number, number, number] => {
  const clamped = Math.min(NORMALIZED_MAX, Math.max(NORMALIZED_MIN, value));
  COLOR_RAMP.forEach((colorStop, index): [number, number, number] | undefined => {
    const start = colorStop;
    const end = COLOR_RAMP[index + RAMP_INDEX_STEP];
    if (clamped >= start.stop && clamped <= end.stop) {
      const range = end.stop - start.stop || NORMALIZED_MAX;
      const t = (clamped - start.stop) / range;
      return [
        Math.round(lerp(start.color[CHANNEL_RED], end.color[CHANNEL_RED], t)),
        Math.round(lerp(start.color[CHANNEL_GREEN], end.color[CHANNEL_GREEN], t)),
        Math.round(lerp(start.color[CHANNEL_BLUE], end.color[CHANNEL_BLUE], t)),
      ];
    }
    return undefined;
  });
  return COLOR_RAMP[COLOR_RAMP.length - RAMP_LAST_OFFSET].color;
};

export const colorizeHeatmapImageData = (
  imageData: ImageData,
  intensityGain: number,
): void => {
  const { data } = imageData;
  data.forEach((value, index) => {
    const alpha = value;
    if (alpha === BYTE_ZERO) {
      return;
    }
    const intensity = Math.min(NORMALIZED_MAX, (alpha / BYTE_MAX) * intensityGain);
    const [r, g, b] = getRampColor(intensity);
    data[index + CHANNEL_RED] = r;
    data[index + CHANNEL_GREEN] = g;
    data[index + CHANNEL_BLUE] = b;
    data[index + CHANNEL_ALPHA] = Math.round(BYTE_MAX * intensity);
  });
};
