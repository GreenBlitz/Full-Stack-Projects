from scripts.wpilog_parsing.driving_scores import joystick_speed_peaks
from scripts.wpilog_parsing.wpilog import WpiLog


def main():
    path = sys.argv[0]
    wpilog = WpiLog.load(path)
    joystick_norm_speed_peaks, joystick_angular_speed_peaks = joystick_speed_peaks(wpilog)
    result = {
        "joystickNormSpeedPeaks": joystick_norm_speed_peaks,
        "joystickAngularSpeedPeaks": joystick_angular_speed_peaks
    }
    print(json.dumps(result))


if __name__ == '__main__':
    main()
