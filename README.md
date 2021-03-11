[![End-to-End](https://github.com/open-rmf/rmf-web/workflows/End-to-End/badge.svg?branch=main)](https://github.com/open-rmf/rmf-web/actions?query=workflow%3AEnd-to-End+branch%3Amain) [![ros2-bridge](https://github.com/open-rmf/rmf-web/workflows/ros2-bridge/badge.svg?branch=main)](https://github.com/open-rmf/rmf-web/actions?query=workflow%3Aros2-bridge+branch%3Amain) [![react-components](https://github.com/open-rmf/rmf-web/workflows/react-components/badge.svg?branch=main)](https://github.com/open-rmf/rmf-web/actions?query=workflow%3Areact-components+branch%3Amain) [![dashboard](https://github.com/open-rmf/rmf-web/workflows/dashboard/badge.svg?branch=main)](https://github.com/open-rmf/rmf-web/actions?query=workflow%3Adashboard+branch%3Amain) [![api-server](https://github.com/open-rmf/rmf-web/workflows/api-server/badge.svg?branch=main)](https://github.com/open-rmf/rmf-web/actions?query=workflow%3Aapi-server+branch%3Amain) [![codecov](https://codecov.io/gh/open-rmf/rmf-web/branch/main/graph/badge.svg)](https://codecov.io/gh/open-rmf/rmf-web)

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
* [rmf_core](https://github.com/open-rmf/rmf_core)
* [traffic_editor](https://github.com/open-rmf/traffic_editor)
* [rmf schedule visualizer](https://github.com/open-rmf/rmf_schedule_visualizer)
* [rmf_demos](https://github.com/open-rmf/rmf_demos)

## Bootstrap
Before running the commands, make sure that rmf is sourced. We recommend using an `npm` version lower than 7.0.0 ([more information](https://github.com/open-rmf/rmf-web/issues/232)).
```bash
git clone https://github.com/open-rmf/rmf-web
cd rmf-web
npm run bootstrap
```

## Launching
Before running the commands, make sure that rmf is sourced.
```bash
cd packages/dashboard
npm start
```
When presented with a login screen, use `user=admin password=admin`.

This launches a development server with the office world from `rmf_demos`. The server is useful for development but is obviously not useful for actual usage.

### Bootstrapping only some packages
If you are only interested in a particular package, you can run
```bash
npm run bootstrap -- <package>
```
to bootstrap only that package. e.g.
```bash
npm run bootstrap -- packages/react-components
```
will only bootstrap `react-components` and it's dependencies.

## Troubleshooting
First thing to try is to build rmf from source, in order to speed up development, `rmf-web` may use in-development features of rmf. That means that the binary releases may not have the features required, sometimes the features `rmf-web` uses may be so new that not even the rolling releases has it.

Refer to [rmf_demos](https://github.com/open-rmf/rmf_demos) for instructions to build rmf. You should end up with a colcon workspace with all of rmf packages, remember to source the workspace before running any of the commands.

## Deploying
* Build all the packages with the version of you are using in your deployment of RMF. This is important because message definitions and other behaviors might change depending on your version of RMF. The easiest way to do this is to source your version of RMF and run `npm run bootstrap`.

* Build the dashboard with the config of your deployment, refer to the [instructions](./packages/dashboard/README.md#external-server) for connecting to an external server. You want to make sure the urls matches the location where you are hosting the various backends.

* Make sure that the server for dashboard is set up to support client side routing, it should serve `index.html` for other routes.

* Use a sql database for keycloak and configure your keycloak settings. Refer to [keycloak docs](https://www.keycloak.org/getting-started) for more information regarding keycloak deployment. **DO NOT** use the default admin password.

* Use a sql database for `api-server`, by default it keeps a sqlite database in memory, obviously that is not suitable for production.

* Use a ssl termination proxy to provide https connection. Some of the components only support http and should never be exposed to the outside directly. Also make sure to use a valid certificate.

* The following services should be deployed
    * ros2-bridge
    * api-server
    * keycloak
    * web server

### About deployment with kubernetes
Kubernetes is an easy way to manage a web stack deployment, there are some minor things that you should take note of if you are using kubernetes (or other container based deployment).

* **DO** use a base image with the correct version of RMF for services that connects to rmf (ros2-bridge, api-server). **DO NOT** use a public image, it may not have the correct message definitions.
* **DO** build or install only rmf message packages to keep image size down.
* **DO NOT** build the packages in `rmf-web` on the host and copy it into the image. Instead, copy the source files and build the packages from within the container.
* **DO NOT** run multiple instance of `api-server`. It is not designed to support concurrency.

# Further documentation

Please refer to the README in each package.
