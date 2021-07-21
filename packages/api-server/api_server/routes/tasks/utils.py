import rclpy.node
from rmf_task_msgs.msg import TaskSummary as RmfTaskSummary

from ...models.tasks import TaskProgress, TaskSummary


def get_task_progress(
    task_summary: TaskSummary, ros_node: rclpy.node.Node
) -> TaskProgress:
    """
    convert rmf task summary msg to a task
    """
    now = ros_node.get_clock().now().to_msg().sec  # only use sec
    # Generate a progress percentage
    duration = abs(task_summary.end_time.sec - task_summary.start_time.sec)
    # check if is completed
    if task_summary.state == RmfTaskSummary.STATE_COMPLETED:
        progress = "100%"
    # check if it state is queued/cancelled
    elif duration == 0 or (task_summary.state in [0, 4]):
        progress = "0%"
    else:
        percent = int(100 * (now - task_summary.start_time.sec) / float(duration))
        if percent < 0:
            progress = "0%"
        elif percent > 100:
            progress = "Delayed"
        else:
            progress = f"{percent}%"
    return TaskProgress(status=progress)
