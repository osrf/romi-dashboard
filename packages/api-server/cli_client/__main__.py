import argparse
import signal

import socketio


def main():
    parser = argparse.ArgumentParser(description="echo events from the rmf api server")
    parser.add_argument(
        "--url",
        default="http://localhost:8000",
        help="defaults to http://localhost:8000",
    )
    parser.add_argument("topic", nargs=1, help="topic to listen on")
    args = parser.parse_args()

    sio = socketio.Client()
    signal.signal(signal.SIGINT, lambda _sig, _frame: sio.disconnect())
    sio.connect(args.url)

    @sio.on("connect")
    def on_connect():
        sio.emit("subscribe", args.topic[0])
        sio.on(args.topic[0], print)


if __name__ == "__main__":
    exit(main())
