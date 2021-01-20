#!/bin/bash

export TS_NODE_PROJECT="${TS_NODE_PROJECT:-tsconfig.json}"
export REACT_APP_TRAJECTORY_SERVER="${REACT_APP_TRAJECTORY_SERVER:-ws://localhost:8006}"
export REACT_APP_ROS2_BRIDGE_SERVER="${REACT_APP_ROS2_BRIDGE_SERVER:-ws://localhost:50002}"
default_auth_config='{ "realm": "master", "clientId": "romi-dashboard", "url": "http://localhost:8088/auth" }'
export REACT_APP_AUTH_CONFIG="${REACT_APP_AUTH_CONFIG:-$default_auth_config}"
export ROMI_DASHBOARD_PORT="${ROMI_DASHBOARD_PORT:-5000}"
export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-romidashboarde2e}"
