[![End-to-End](https://github.com/osrf/rmf-web/workflows/End-to-End/badge.svg?branch=main)](https://github.com/osrf/rmf-web/actions?query=workflow%3AEnd-to-End+branch%3Amain) [![ros2-bridge](https://github.com/osrf/rmf-web/workflows/ros2-bridge/badge.svg?branch=main)](https://github.com/osrf/rmf-web/actions?query=workflow%3Aros2-bridge+branch%3Amain) [![react-components](https://github.com/osrf/rmf-web/workflows/react-components/badge.svg?branch=main)](https://github.com/osrf/rmf-web/actions?query=workflow%3Areact-components+branch%3Amain) [![dashboard](https://github.com/osrf/rmf-web/workflows/dashboard/badge.svg?branch=main)](https://github.com/osrf/rmf-web/actions?query=workflow%3Adashboard+branch%3Amain) [![api-server](https://github.com/osrf/rmf-web/workflows/api-server/badge.svg?branch=main)](https://github.com/osrf/rmf-web/actions?query=workflow%3Aapi-server+branch%3Amain) [![codecov](https://codecov.io/gh/osrf/rmf-web/branch/main/graph/badge.svg)](https://codecov.io/gh/osrf/rmf-web)

# Running the Dashboard

## Prerequisites

### Ubuntu 20.04

Install docker and docker-compose
```bash
sudo apt update && sudo apt install docker.io docker-compose
```

If you're using GNOME or KDE, there will be a pop-up window to ask for privilege escalation when running the Docker container which runs Keycloak, the authentication mechanism we are currently using.
If you're using `i3` or other "unusual" window managers, this pop-up may not occur, which can be confusing since a password prompt can be easily lost in the console text stream.
You can add yourself to the `docker` group to allow containers to start without requesting your password:
```
sudo usermod -aG docker $USER
```
After issuing this command, you may need to logout/login or restart your system depending on your OS/environment.

Keep in mind that this convenience has security implications. This tradeoff is described in more detail in the Docker documentation:
https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user

Install nodejs
```bash
sudo apt update && sudo apt install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
nvm install 12
```

A recent version of pipenv is needed, the system packaged version is too old.
```bash
pip3 install pipenv
```

Install rmf
```bash
sudo apt update && sudo apt install curl gnupg2 lsb-release
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -
sudo sh -c 'echo "deb [arch=$(dpkg --print-architecture)] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/ros2-latest.list'
sudo sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list'
wget https://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -
curl -sL http://rmf.servehttp.com/repos.key | sudo apt-key add -
echo 'deb [arch=amd64] http://rmf.servehttp.com/ubuntu/main focal main' | sudo tee /etc/apt/sources.list.d/rmf.list
sudo apt update && sudo apt install '^ros-foxy-rmf-.*'
```

### Others

Refer to the following documentations:

* [docker](https://docs.docker.com/engine/install/ubuntu/)
* [docker-compose](https://docs.docker.com/compose/install/)
* [nodejs](https://nodejs.org/en/download/package-manager/)
  * alternative: [nvm](https://github.com/nvm-sh/nvm)
* [rmf_core](https://github.com/osrf/rmf_core)
* [traffic_editor](https://github.com/osrf/traffic_editor)
* [rmf schedule visualizer](https://github.com/osrf/rmf_schedule_visualizer)
* [rmf_demos](https://github.com/osrf/rmf_demos)

## Bootstrap
Before running the commands, make sure that rmf is sourced.
```bash
git clone https://github.com/osrf/rmf-web
cd rmf-web
npm run bootstrap
```

## Launching
Before running the commands, make sure that rmf is sourced.
```bash
cd packages/dashboard
npm start
```
When presented with a login screen, use `user=admin password=admin`

## Troubleshooting
First thing to try is to build rmf from source, the dashboard currently does not guarantee support for different versions of rmf. Refer to each of the rmf repos for instruction to build them.

# Further documentation

Please see the [README](packages/dashboard/README.md) in the dashboard package.
