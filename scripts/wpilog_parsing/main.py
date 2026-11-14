import json
import sys

import driving_scores
from wpilog import WpiLog


def main():
    path = sys.argv[1]
    log = WpiLog.load(path)
    joystick_norm_speed_peaks, joystick_angular_speed_peaks = driving_scores.joystick_speed_peaks(log)
    result = {
        "joystickNormSpeedPeaks": joystick_norm_speed_peaks,
        "joystickAngularSpeedPeaks": joystick_angular_speed_peaks
    }
    print(json.dumps(result))


if __name__ == '__main__':
    main()
