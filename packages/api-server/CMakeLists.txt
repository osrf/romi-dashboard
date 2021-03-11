cmake_minimum_required(VERSION 3.16)
project(api_server)

find_package(rmf_charger_msgs 1.2 REQUIRED)
find_package(rmf_dispenser_msgs 1.2 REQUIRED)
find_package(rmf_door_msgs 1.2 REQUIRED)
find_package(rmf_fleet_msgs 1.2 REQUIRED)
find_package(rmf_ingestor_msgs 1.2 REQUIRED)
find_package(rmf_lift_msgs 1.2 REQUIRED)
find_package(rmf_task_msgs 1.2 REQUIRED)
find_package(rmf_traffic_msgs 1.2 REQUIRED)
find_package(rmf_workcell_msgs 1.2 REQUIRED)
find_package(building_map_msgs 1.2 REQUIRED)

find_package(ament_cmake REQUIRED)

function(append_rosidl_interfaces var resource_name)
  ament_index_get_resource(result rosidl_interfaces ${resource_name})
  ament_index_has_resource(resource_prefix rosidl_interfaces ${resource_name})
  string(REPLACE "\n" ";" result_list ${result})
  foreach(interface ${result_list})
    list(APPEND out ${resource_prefix}/share/${resource_name}/${interface})
  endforeach()
  set(${var} ${out} PARENT_SCOPE)
endfunction()

ament_index_get_prefix_path(ament_paths)
append_rosidl_interfaces(rmf_interfaces rmf_charger_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_dispenser_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_door_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_fleet_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_ingestor_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_lift_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_task_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_traffic_msgs)
append_rosidl_interfaces(rmf_interfaces rmf_workcell_msgs)
append_rosidl_interfaces(rmf_interfaces building_map_msgs)

add_custom_command(
  OUTPUT ${CMAKE_CURRENT_SOURCE_DIR}/api_server/models/mixins/rev
  COMMAND ${CMAKE_CURRENT_SOURCE_DIR}/generate_mixins.sh
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  DEPENDS ${rmf_interfaces}
)

add_custom_target(generate_mixins ALL
  DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/api_server/models/mixins/rev
)
