import math

import util
from wpilog import WpiLog

SECONDS_PER_CYCLE = 0.02
JOYSTICK_AXIS_VALUES_SIGNAL_NAME = "/DriverStation/Joystick0/AxisValues"
MAXIMUM_JOYSTICK_NORM_SPEED = 10
MAXIMUM_JOYSTICK_ANGLE_SPEED = 10
MINIMUM_STILL_JOYSTICK_NORM = 0.07


def get_driving_scores_JSON(log: WpiLog):
    return {
        "timeStillSeconds": time_still_seconds(log),
        "joystickNormSpeedPeaks": joystick_norm_speed_peaks(log),
        "joystickAngularSpeedPeaks": joystick_angular_speed_peaks(log)
    }


def time_still_seconds(log: WpiLog):
    joystick_axis_values_signal = log.get(JOYSTICK_AXIS_VALUES_SIGNAL_NAME)
    left_joystick_norm_signal = (util
                                 .getJoystickNorm("left joystick norm", joystick_axis_values_signal, 0, 1))
    cycles_still_counter = 0
    for left_joystick_norm, axis_values in zip(left_joystick_norm_signal, joystick_axis_values_signal):
        if ((left_joystick_norm.value < MINIMUM_STILL_JOYSTICK_NORM)
                and (axis_values.value[5] < MINIMUM_STILL_JOYSTICK_NORM)):
            cycles_still_counter += 1
    return cycles_still_counter * SECONDS_PER_CYCLE


def joystick_norm_speed_peaks(log: WpiLog):
    joystick_axis_values_signal = log.get(JOYSTICK_AXIS_VALUES_SIGNAL_NAME)
    joystick_norm_speed_signal = (util
                                  .getJoystickNorm("joystick norm", joystick_axis_values_signal, 0, 1)
                                  .differentiate())
    norm_speed_peaks_counter = 0

    for norm_speed in joystick_norm_speed_signal:
        if math.fabs(norm_speed.value) > MAXIMUM_JOYSTICK_NORM_SPEED:
            norm_speed_peaks_counter += 1

    return norm_speed_peaks_counter


def joystick_angular_speed_peaks(log: WpiLog):
    joystick_axis_values_signal = log.get(JOYSTICK_AXIS_VALUES_SIGNAL_NAME)
    joystick_angular_speed_signal = (util
                                     .getJoystickAngle("joystick angle", joystick_axis_values_signal, 0, 1)
                                     .differentiate())
    angular_speed_peaks_counter = 0

    for angle_speed in joystick_angular_speed_signal:
        if math.fabs(angle_speed.value) > MAXIMUM_JOYSTICK_ANGLE_SPEED:
            angular_speed_peaks_counter += 1

    return angular_speed_peaks_counter
