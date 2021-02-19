from datetime import datetime, timezone

from builtin_interfaces.msg import Time as RosTime


def ros_to_py_datetime(ros_time: RosTime) -> datetime:
    """
    ros_time is assumed to be utc.
    """
    return datetime.fromtimestamp(
        ros_time.sec + ros_time.nanosec / 1000000000, timezone.utc
    )


def py_to_ros_time(py_datetime: datetime) -> RosTime:
    """
    ros_time is assumed to be utc.
    """
    utc_timestamp = py_datetime.timestamp() - py_datetime.utcoffset().total_seconds()
    return RosTime(
        sec=int(utc_timestamp), nanosec=int((utc_timestamp % 1) * 1000000000)
    )
