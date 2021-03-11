#!/bin/bash
set -e

cd $(dirname $0)
python3 -m pipenv run python3 -m ros_tortoise -o api_server/models/mixins \
  rmf_charger_msgs \
  rmf_dispenser_msgs \
  rmf_door_msgs \
  rmf_fleet_msgs \
  rmf_ingestor_msgs \
  rmf_lift_msgs \
  rmf_task_msgs \
  rmf_traffic_msgs \
  rmf_workcell_msgs \
  building_map_msgs
python3 -m pipenv run python3 -m pipenv run python3 -m black api_server/models/mixins
