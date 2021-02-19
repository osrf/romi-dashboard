const doors = [
  {
    name: 'airport_n01_door',
    v1_x: 0,
    v1_y: -40.5,
    v2_x: 2.9,
    v2_y: -40.5,
    door_type: 2,
    motion_range: 0,
    motion_direction: 1,
  },
  {
    name: 'airport_n03_door',
    v1_x: 28,
    v1_y: -47.4,
    v2_x: 29.5,
    v2_y: -47.4,
    door_type: 1,
    motion_range: 1.571,
    motion_direction: -1,
  },
  {
    name: 'airport_smk_door',
    v1_x: 16.5,
    v1_y: -11.6,
    v2_x: 16.5,
    v2_y: -14.8,
    door_type: 1,
    motion_range: 1.571,
    motion_direction: 1,
  },
  {
    name: 'airport_n08_door',
    v1_x: 91.8,
    v1_y: -45.3,
    v2_x: 94.3,
    v2_y: -45.3,
    door_type: 1,
    motion_range: -1.571,
    motion_direction: 1,
  },
];

const places = [
  {
    name: 'airport_place1',
    x: 25,
    y: -8,
    yaw: 0,
    position_tolerance: 0,
    yaw_tolerance: 0,
  },
];

const airportMap = {
  doors: doors,
  places: places,
};

export default airportMap;
