#-----------------
# Stage 1 - build
#-----------------

FROM ros:foxy AS builder

# add gazebo/ignition repo
RUN apt-get update && apt-get install -y curl wget \
  && sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list' \
  && wget http://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -

WORKDIR /root/rmf

RUN mkdir src && cd src \
  && git clone --depth 1 https://github.com/osrf/rmf_core \
  && git clone --depth 1 https://github.com/osrf/traffic_editor \
  && git clone --depth 1 https://github.com/osrf/rmf_schedule_visualizer \
  && git clone --depth 1 https://github.com/osrf/rmf_demos

# install ros dependencies
RUN apt-get update && rosdep update && rosdep install --from-paths src --ignore-src -yr

# other dependencies
RUN apt-get update && apt-get install -y \
  # needed by traffic editor
  libignition-common3-dev libignition-plugin-dev \
  && rm -rf /var/lib/apt/lists/*

# build rmf
RUN /ros_entrypoint.sh colcon build --merge-install --cmake-args -DCMAKE_BUILD_TYPE=Release

#----------
# Stage 2
#----------

FROM builder

WORKDIR /root

# TODO: rosdep doesn't support installing only exec dependencies (https://github.com/ros-infrastructure/rosdep/pull/727)
#   When the PR is merged, we can do a multi-stage build and include only whats needed at runtime.
# FROM ros:foxy
# COPY --from=0 /root/rmf/install /opt/rmf
# RUN rosdep ...
COPY --from=builder /root/rmf/install /opt/rmf
RUN rm -rf /root/rmf

ADD rmf_entrypoint.bash /
ENTRYPOINT ["/rmf_entrypoint.bash"]
CMD ["bash"]
