import math

from wpilog import Signal, WpiLog

JOYSTICK_AXIS_VALUES_SIGNAL_NAME = "/DriverStation/Joystick0/AxisValues"
MAXIMUM_JOYSTICK_NORM_SPEED = 10
MAXIMUM_JOYSTICK_ANGLE_SPEED = 10


def joystick_speed_peaks(log: WpiLog):
    joystick_axis_values_signal = log.get(JOYSTICK_AXIS_VALUES_SIGNAL_NAME)
    joystick_norm_signal = Signal("joystick norm", "float")
    joystick_angle_signal = Signal("joystick angle", "float")

    for time, axis_values in joystick_axis_values_signal:
        x_value = axis_values[0]
        y_value = axis_values[1]
        joystick_norm_signal.append(time, math.sqrt(math.pow(x_value, 2) + math.pow(y_value, 2)))
        joystick_angle_signal.append(time, math.atan2(y_value, x_value))
    joystick_norm_speed_signal = joystick_norm_signal.differentiate()
    joystick_angle_speed_signal = joystick_angle_signal.differentiate()

    norm_speed_peaks_counter = 0
    angle_speed_peaks_counter = 0
    for norm_speed in joystick_norm_speed_signal:
        if norm_speed.value > MAXIMUM_JOYSTICK_NORM_SPEED:
            norm_speed_peaks_counter += 1
    for angle_speed in joystick_angle_speed_signal:
        if angle_speed.value > MAXIMUM_JOYSTICK_ANGLE_SPEED:
            angle_speed_peaks_counter += 1

    return norm_speed_peaks_counter, angle_speed_peaks_counter
