const doors = [
  {
    name: 'main_door',
    v1_x: 8.2,
    v1_y: -5.5,
    v2_x: 7.85,
    v2_y: -6.2,
    door_type: 2,
    motion_range: -1.571,
    motion_direction: 1,
  },
  {
    name: 'hardware_door',
    v1_x: 4.9,
    v1_y: -4,
    v2_x: 4.4,
    v2_y: -5,
    door_type: 1,
    motion_range: 1.571,
    motion_direction: -1,
  },
  {
    name: 'coe_door',
    v1_x: 19.5,
    v1_y: -10.8,
    v2_x: 19.5,
    v2_y: -9.9,
    door_type: 1,
    motion_range: 1.571,
    motion_direction: 1,
  },
  {
    name: 'exit_door',
    v1_x: 12.2,
    v1_y: -2.7,
    v2_x: 14.1,
    v2_y: -2.7,
    door_type: 1,
    motion_range: -1.571,
    motion_direction: 1,
  },
];

const lifts = [
  {
    name: 'Lift1',
    doors: [
      {
        name: 'lift1_front_door',
        v1_x: 8.8,
        v1_y: -2.3,
        v2_x: 7.7,
        v2_y: -4.5,
        door_type: 1,
        motion_range: 0,
        motion_direction: 1,
      },
    ],
    levels: ['L1', 'L2', 'L3'],
    ref_x: 7.1,
    ref_y: -2.8,
    ref_yaw: -0.5,
    width: 2.5,
    depth: 2.5,
    wall_graph: {
      name: 'wallgraph',
      vertices: [],
      edges: [],
      params: [],
    },
  },
  {
    name: 'Lift2',
    doors: [
      {
        name: 'lift2_front_door',
        v1_x: 8.95,
        v1_y: -12.38,
        v2_x: 10.08,
        v2_y: -12.38,
        door_type: 1,
        motion_range: 0,
        motion_direction: 1,
      },
    ],
    levels: ['L1', 'L2', 'L3', 'L4'],
    ref_x: 9.5,
    ref_y: -13,
    ref_yaw: 1.571,
    width: 1,
    depth: 1,
    wall_graph: {
      name: 'wallgraph',
      vertices: [],
      edges: [],
      params: [],
    },
  },
  {
    name: 'mysterious_lift',
    doors: [],
    levels: ['L1', 'L2', 'L3', 'L4'],
    ref_x: 22,
    ref_y: -10,
    ref_yaw: 1.571,
    width: 1,
    depth: 1,
    wall_graph: {
      name: 'wallgraph',
      vertices: [],
      edges: [],
      params: [],
    },
  },
];

const places = [
  {
    name: 'Place1',
    x: 2,
    y: -2,
    yaw: 0,
    position_tolerance: 0,
    yaw_tolerance: 0,
  },
  {
    name: 'Place2',
    x: 8,
    y: -4,
    yaw: 0,
    position_tolerance: 0,
    yaw_tolerance: 0,
  },
];

const nav_graphs = [
  {
    name: 'nav_graphs',
    edges: [],
    params: [],
    vertices: [
      { x: 11.651602745056152, y: -6.966331958770752, name: 'station_1', params: [] },
      { x: 16.84633445739746, y: -5.404067039489746, name: 'pantry', params: [] },
      { x: 18.737306594848633, y: -3.823754072189331, name: 'lounge', params: [] },
      { x: 20.802032470703125, y: -10.314054489135742, name: 'hardware_1', params: [] },
      { x: 11.566947937011719, y: -9.20584487915039, name: 'cubicle_1', params: [] },
      { x: 15.15323543548584, y: -6.904762268066406, name: 'station_2', params: [] },
      { x: 15.137845993041992, y: -9.167360305786133, name: 'cubicle_2', params: [] },
      { x: 20.9482479095459, y: -7.497346878051758, name: 'hardware_2', params: [] },
      { x: 6.603085994720459, y: -5.227062225341797, name: 'coe', params: [] },
      { x: 11.55336856842041, y: -11.315971374511719, name: 'magni1_charger', params: [] },
      { x: 15.15718936920166, y: -11.227091789245605, name: 'magni2_charger', params: [] },
      { x: 6.264034271240234, y: -3.515686273574829, name: 'supplies', params: [] },
      { x: 18.75492286682129, y: -9.059619903564453, name: 'cubicle_3', params: [] },
    ],
  },
];

const officeMap = {
  doors: doors,
  places: places,
  lifts: lifts,
  nav_graphs: nav_graphs,
};

export default officeMap;
