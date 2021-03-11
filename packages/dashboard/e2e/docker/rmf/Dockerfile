FROM ros:foxy AS builder

SHELL ["/bin/bash", "-c"]

# set up repos
RUN rosdep update && \
  apt-get update && \
  apt-get install -y wget && \
  sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list' && \
  wget https://packages.osrfoundation.org/gazebo.key -O - | apt-key add -

# install non-ros dependencies
RUN apt-get update && apt-get install -y \
    git \
    cmake \
    python3-vcstool \
    curl \
    qt5-default \
    python3-shapely \
    python3-yaml \
    python3-requests \
    python3-colcon* \
    python3-pip && \
  python3 -m pip install flask-socketio

# download the codes
RUN mkdir -p ~/rmf_ws/src && \
  cd ~/rmf_ws && \
  wget https://raw.githubusercontent.com/open-rmf/rmf/main/rmf.repos && \
  vcs import src < rmf.repos

# install ros dependencies
RUN cd ~/rmf_ws && \
  rosdep install --from-paths src --ignore-src --rosdistro foxy -yr

# compile
RUN cd ~/rmf_ws && \
  source /opt/ros/foxy/setup.bash && \
  colcon build --merge-install --install-base /opt/rmf --cmake-args -DCMAKE_BUILD_TYPE=Release

COPY rmf_entrypoint.bash /
ENTRYPOINT ["/rmf_entrypoint.bash"]
CMD ["bash"]
