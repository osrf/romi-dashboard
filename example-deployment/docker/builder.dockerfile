FROM ros:foxy-ros-base-focal

RUN apt-get update && apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  apt-get update && apt-get install -y nodejs python3-pip

RUN pip3 install pipenv

COPY rmf/rmf_internal_msgs/rmf_charger_msgs /root/rmf_ws/src/rmf_charger_msgs
COPY rmf/rmf_internal_msgs/rmf_dispenser_msgs /root/rmf_ws/src/rmf_dispenser_msgs
COPY rmf/rmf_internal_msgs/rmf_door_msgs /root/rmf_ws/src/rmf_door_msgs
COPY rmf/rmf_internal_msgs/rmf_fleet_msgs /root/rmf_ws/src/rmf_fleet_msgs
COPY rmf/rmf_internal_msgs/rmf_ingestor_msgs /root/rmf_ws/src/rmf_ingestor_msgs
COPY rmf/rmf_internal_msgs/rmf_lift_msgs /root/rmf_ws/src/rmf_lift_msgs
COPY rmf/rmf_internal_msgs/rmf_task_msgs /root/rmf_ws/src/rmf_task_msgs
COPY rmf/rmf_internal_msgs/rmf_traffic_msgs /root/rmf_ws/src/rmf_traffic_msgs
COPY rmf/rmf_internal_msgs/rmf_workcell_msgs /root/rmf_ws/src/rmf_workcell_msgs
COPY rmf/rmf_building_map_msgs /root/rmf_ws/src/rmf_building_map_msgs

SHELL ["bash", "-c"]
RUN . /opt/ros/foxy/setup.bash && cd /root/rmf_ws && \
  colcon build --merge-install --install-base /opt/rmf --cmake-args -DCMAKE_BUILD_TYPE=Release

RUN rm -rf /root/rmf_ws

RUN apt install ros-foxy-rmw-cyclonedds-cpp -y

ENV CYCLONEDDS_URI=file:///cyclonedds/cyclonedds.xml
ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
ENV ROS_DOMAIN_ID=6
