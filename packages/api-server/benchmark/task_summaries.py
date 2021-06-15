import argparse
import os
import subprocess
import sys
import threading
import time

import rclpy
import rclpy.node
from rmf_task_msgs.msg import TaskSummary

parser = argparse.ArgumentParser()
parser.add_argument("--count", "-c", type=int, required=True)
parser.add_argument("--rate", "-r", type=int, required=True)
parser.add_argument("--profile", action="store_true")
args = parser.parse_args()

os.environ["RMF_API_SERVER_CONFIG"] = f"{os.path.dirname(__file__)}/config.py"

print("starting rmf api server...")

if args.profile:
    cmd = ["python3", "-m", "cProfile", "-o", "profile.cProfile", "-m", "api_server"]
else:
    cmd = ["python3", "-m", "api_server"]

with subprocess.Popen(
    cmd,
    cwd=f"{os.path.dirname(__file__)}/..",
    env=os.environ,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
) as proc:
    rclpy.init()

    logged_count = 0

    def read_stdout():
        global logged_count
        while True:
            line = proc.stdout.readline()
            if len(line) == 0:
                break
            if line.startswith("INFO:app.BookKeeper.task_summary:"):
                logged_count += 1

    read_stdout_thread = threading.Thread(target=read_stdout)
    read_stdout_thread.start()

    time.sleep(3)  # wait for app the be ready and ros discovery to finish

    print(f"publishing {args.count} messages at a rate of {args.rate} hz")

    node = rclpy.node.Node("benchmark")
    publisher = node.create_publisher(TaskSummary, "task_summaries", 10)
    task_summary = TaskSummary(task_id="benchmark_task")
    pub_count = 0
    fut = rclpy.Future()

    def pub():
        global pub_count
        task_summary.status = str(pub_count + 1)
        publisher.publish(task_summary)
        pub_count += 1
        if pub_count >= args.count:
            timer.destroy()
            fut.set_result(True)

    timer = node.create_timer(1 / args.rate, pub)

    start = time.time_ns()
    rclpy.spin_until_future_complete(node, fut)
    rclpy.shutdown()

    # wait for pending writes to finish
    prev_logged_count = 0
    while prev_logged_count != logged_count:
        prev_logged_count = logged_count
        time.sleep(0.1)
    elasped = (time.time_ns() - start) / 1000000000

    proc.terminate()
    proc.wait()
    read_stdout_thread.join()

    exit_code = 0
    print(f"tasks/sec = {logged_count / elasped}")
    if logged_count == args.count:
        print("OK")
    else:
        print(
            f"ERROR, published {args.count} tasks, but only {logged_count} tasks are logged"
        )
        exit_code = 1

    if args.profile:
        print(
            "profile output written to 'profile.cProfile', use 'python3 benchmarks/print_stats.py' to view it"
        )

    sys.exit(exit_code)
