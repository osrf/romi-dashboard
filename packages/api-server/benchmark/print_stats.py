import argparse
import pstats
from pstats import SortKey

parser = argparse.ArgumentParser(
    "print_stats",
    description="Helper script to print the stats of a cProfile output. See https://docs.python.org/3/library/profile.html for more information.",
)
parser.add_argument(
    "--all",
    action="store_true",
    help="print all functions instead of only 'api_server' functions",
)
args = parser.parse_args()

try:
    restrictions = []
    if not args.all:
        restrictions.append("api_server")
    pstats.Stats("profile.cProfile").sort_stats(SortKey.TIME).print_stats(*restrictions)
except BrokenPipeError:
    pass
