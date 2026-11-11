import math

from scripts.wpilog_parsing.wpilog import Signal, WpiLog

JOYSTICK_X_SIGNAL_NAME = ""
JOYSTICK_Y_SIGNAL_NAME = ""
MAXIMUM_JOYSTICK_NORM_SPEED = 0
MAXIMUM_JOYSTICK_ANGLE_SPEED = 0


def joystick_speed_peaks(log: WpiLog):
    joystick_x_signal = log.get(JOYSTICK_X_SIGNAL_NAME)
    joystick_y_signal = log.get(JOYSTICK_Y_SIGNAL_NAME)

    joystick_norm_signal = Signal("joystick norm", "double")
    joystick_angle_signal = Signal("joystick angle", "double")
    for (x_time, x_value), (y_time, y_value) in zip(joystick_x_signal, joystick_y_signal):
        joystick_norm_signal.append(x_time, math.sqrt(math.pow(x_value, 2) + math.pow(y_value, 2)))
        joystick_angle_signal.append(x_time, math.atan2(y_value, x_value))
    joystick_norm_speed_signal = joystick_norm_signal.differentiate()
    joystick_angle_speed_signal = joystick_angle_signal.differentiate()

    norm_speed_peaks_counter = 0
    angle_speed_peaks_counter = 0
    for norm_speed in joystick_norm_speed_signal:
        if norm_speed.value > MAXIMUM_JOYSTICK_NORM_SPEED:
            norm_speed_peaks_counter += 1
    for angle_speed in joystick_angle_speed_signal:
        if angle_speed > MAXIMUM_JOYSTICK_ANGLE_SPEED:
            angle_speed_peaks_counter += 1

    return norm_speed_peaks_counter, angle_speed_peaks_counter
