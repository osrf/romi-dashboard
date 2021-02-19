import { makeLauncher } from '../../rmf-launcher';
import { login, overwriteClick } from './utils';

describe('ui interactions', () => {
  const launcher = makeLauncher();

  before(async () => await launcher.launch());
  after(async () => await launcher.kill());

  before(() => overwriteClick());
  before(() => browser.url('/'));

  before(login);

  it('clicking a door on the map focuses it on the panel', () => {
    const door = $(`[data-component=DoorMarker]`);
    const doorName = door.getAttribute('aria-label');
    door.waitForClickable();
    door.click();

    expect($(`.MuiAccordion-root*=${doorName}`).$('.MuiAccordionDetails-root')).toBeVisible();
  });

  it('clicking a dispenser on the map focuses it on the panel', () => {
    const dispenser = $('[data-component=DispenserMarker]');
    const guid = dispenser.getAttribute('aria-label');
    dispenser.click();

    expect($(`.MuiAccordion-root*=${guid}`).$('.MuiAccordionDetails-root')).toBeVisible();
  });

  it('clicking a robot on the map focuses it on the panel', () => {
    const robot = $('[data-component=RobotMarker]');
    const robotName = robot.getAttribute('aria-label');
    robot.click();

    expect($(`.MuiAccordion-root*=${robotName}`).$('.MuiAccordionDetails-root')).toBeVisible();
  });
});
