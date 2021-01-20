import { ReactourStep } from 'reactour';

export const tourText: { [stepName: string]: { id: number; text: string } } = {
  Welcome: { id: 1, text: 'Welcome to RoMi dashboard' },
  Zoom: {
    id: 2,
    text:
      'Click on the zoom buttons to change the view of the floor plan. Alternatively, the scroll button on your mouse would work too!',
  },
  Floorplan: {
    id: 3,
    text:
      'Use the floor plan button to switch between available levels and enabling / disabling the view of different components.',
  },
  Leaflet: {
    id: 4,
    text:
      'Clicking individual components like doors, robots, lifts on the map will open up its corresponding information tab in the Omnipanel.',
  },
  Omnipanel: {
    id: 5,
    text: 'The Omnipanel button on the Dashboard shows the various panel options available.',
  },
  MainMenu: {
    id: 6,
    text:
      'Each Panel is clickable and contains a list of the available items with their corresponding states.',
  },
  DoorPanel: { id: 7, text: 'Let us take a look into the 🚪 Doors Panel.' },
  DoorTab: { id: 8, text: 'Here is an example of what you will see when a door tab is expanded' },
  CommandsPanel: {
    id: 9,
    text:
      'The Commands Panel allows you to send different types of requests that will be handled by RoMi.',
  },
  LoopRequest: {
    id: 10,
    text:
      'An example is the Loop Request, where RoMi will assign the most suitable robot to perform the task at the point of request.',
  },
  Settings: {
    id: 11,
    text: 'The Settings button opens up the drawer for different dashboard settings.',
  },
  TrajAnims: {
    id: 12,
    text: 'Trajectory configurations can be changed using the options available',
  },
  HelpButton: {
    id: 13,
    text: 'The Help button opens up another drawer with useful tools and resources',
  },
  HelpDrawer: {
    id: 14,
    text: `Check out the Hotkey options available and the Tutorial tab opens this guide again. Look out for new features ahead!`,
  },
};

export type stepStyling = {
  backgroundColor: string;
  color: string;
  borderRadius: string;
};

export type stepDetails = {
  [primaryKey: string]: ReactourStep;
};
