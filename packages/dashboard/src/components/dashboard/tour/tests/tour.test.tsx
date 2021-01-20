import { createMount, createShallow } from '@material-ui/core/test-utils';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import DashboardTour from '../tour';
import { tourText } from '../tour-data';

/*react-leaflet does not work well on jsdom,
suppress warnings of not being able to find elements from leaflet*/
jest.spyOn(console, 'warn').mockImplementation(() => {});

const mount = createMount();
const shallow = createShallow();

describe('Dashboard Tour', () => {
  const tourState: boolean = true;
  const setTourState: jest.Mock = jest.fn();
  const setShowSettings: jest.Mock = jest.fn();
  const setShowOmniPanel: jest.Mock = jest.fn();
  const setShowHelp: jest.Mock = jest.fn();
  const clearSpotlights: jest.Mock = jest.fn();
  const setCurrentView: jest.Mock = jest.fn();
  const doorSpotlight: jest.Mock = jest.fn();

  let root: ReactWrapper;
  let expectedText: string;
  let stepText: string;
  let nextBtn: ReactWrapper;
  const tourProps = {
    tourState,
    setTourState,
    setShowSettings,
    setShowOmniPanel,
    setShowHelp,
    clearSpotlights,
    setCurrentView,
    doorSpotlight,
  };
  const wait = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));

  beforeEach(() => {
    root = mount(<DashboardTour tourProps={tourProps} />);
    nextBtn = root.find('[data-testid="next-btn"]').first();
  });

  afterEach(() => {
    root?.unmount();
  });

  it('renders without crashing', () => {
    const tour = shallow(<DashboardTour tourProps={tourProps} />);
    expect(tour).toMatchSnapshot();
  });

  it('renders first welcome step', () => {
    expectedText = tourText.Welcome.text;
    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders zoom button step', async () => {
    expectedText = tourText.Zoom.text;

    nextBtn.simulate('click');
    await wait(5);

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders floor plan button step', async () => {
    expectedText = tourText.Floorplan.text;

    for (let i = 1; i < tourText.Floorplan.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders leaflet step', async () => {
    expectedText = tourText.Leaflet.text;

    for (let i = 1; i < tourText.Leaflet.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders omnipanel button step', async () => {
    expectedText = tourText.Omnipanel.text;

    for (let i = 1; i < tourText.Omnipanel.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders main menu step', async () => {
    expectedText = tourText.MainMenu.text;

    for (let i = 1; i < tourText.MainMenu.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders door panel step', async () => {
    expectedText = tourText.DoorPanel.text;

    for (let i = 1; i < tourText.DoorPanel.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders door tab step', async () => {
    expectedText = tourText.DoorTab.text;

    for (let i = 1; i < tourText.DoorTab.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders commands panel step', async () => {
    expectedText = tourText.CommandsPanel.text;

    for (let i = 1; i < tourText.CommandsPanel.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders loop request step', async () => {
    expectedText = tourText.LoopRequest.text;

    for (let i = 1; i < tourText.LoopRequest.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders settings button step', async () => {
    expectedText = tourText.Settings.text;

    for (let i = 1; i < tourText.Settings.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders traj anims step', async () => {
    expectedText = tourText.TrajAnims.text;

    for (let i = 1; i < tourText.TrajAnims.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders help button step', async () => {
    expectedText = tourText.HelpButton.text;

    for (let i = 1; i < tourText.HelpButton.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('renders help drawer step', async () => {
    expectedText = tourText.HelpDrawer.text;

    for (let i = 1; i < tourText.HelpDrawer.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    stepText = root.find('[data-testid="stepBox"]').first().text();

    expect(stepText.includes(expectedText));
  });

  it('closes the tour when last step button is clicked', async () => {
    for (let i = 0; i < tourText.HelpDrawer.id; i++) {
      nextBtn.simulate('click');
      await wait(5);
    }

    root.find('[data-testid="last-step-btn"]').first().simulate('click');

    expect(setTourState).toHaveBeenCalledTimes(1);
  });
});
