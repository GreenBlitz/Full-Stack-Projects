import math
from wpilog import Signal


def getJoystickNorm(name, joystick_axis_values_signal: Signal, x_index, y_index):
    joystick_norm_signal = Signal(name, "float")
    for time, axis_values in joystick_axis_values_signal:
        x_value = axis_values[x_index]
        y_value = axis_values[y_index]
        joystick_norm_signal.append(time, math.sqrt(math.pow(x_value, 2) + math.pow(y_value, 2)))
    return joystick_norm_signal


def getJoystickAngle(name, joystick_axis_values_signal: Signal, x_index, y_index):
    joystick_angle_signal = Signal(name, "float")
    for time, axis_values in joystick_axis_values_signal:
        x_value = axis_values[x_index]
        y_value = axis_values[y_index]
        joystick_angle_signal.append(time, math.atan2(y_value, x_value))
    return joystick_angle_signal
