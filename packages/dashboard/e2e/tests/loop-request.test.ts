import { makeLauncher } from '../rmf-launcher';
import { getRobotLocations, login, overwriteClick } from './utils';

describe('loop request', () => {
  const launcher = makeLauncher();

  before(async () => await launcher.launch());
  after(async () => await launcher.kill());

  before(() => overwriteClick());
  before(() => browser.url('/'));

  before(login);

  it('rmf responds to loop request', () => {
    $('[data-component=MainMenu] [data-item=Robots]').click();

    const currentRobotLocations = getRobotLocations(browser);

    const backButton = $('[aria-label="Back"]');
    backButton.click();
    $('[data-component=MainMenu] [data-item=Commands]').click();
    const loopRequestForm = $('[data-component=LoopRequestForm]');
    loopRequestForm.click();
    const numLoopsInput = loopRequestForm.$('input[placeholder="Number of loops"]');
    numLoopsInput.waitForClickable();
    numLoopsInput.setValue(1);
    const requestButton = loopRequestForm.$('button=Request');
    requestButton.scrollIntoView();
    requestButton.click();

    backButton.waitForClickable();
    backButton.click();
    $('[data-component=MainMenu] [data-item=Robots]').click();
    const newRobotLocations = getRobotLocations(browser);

    expect(newRobotLocations).not.toMatchObject(currentRobotLocations);
  });
});
