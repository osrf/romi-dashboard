import unittest
from datetime import datetime, timedelta, timezone

from builtin_interfaces.msg import Time as RosTime

from .ros_time import py_to_ros_time, ros_to_py_datetime


class TestRosTime(unittest.TestCase):
    def test_convert_ros_to_py_datetime(self):
        ros_time = RosTime(sec=1611720320, nanosec=927137900)
        py_datetime = ros_to_py_datetime(ros_time)
        self.assertAlmostEqual(py_datetime.timestamp(), 1611720320.9271379, 6)

    def test_convert_py_to_ros_time(self):
        tz = timezone(timedelta(hours=8))
        py_datetime = datetime.fromtimestamp(1611720320.9271379, tz)
        ros_time = py_to_ros_time(py_datetime)
        self.assertEqual(ros_time.sec, 1611691520)
