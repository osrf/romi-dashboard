import { makeLauncher } from '../../rmf-launcher';
import { login, openRequestForm, overwriteClick, requestLoop } from './utils';

describe('Loop request for negotiations', () => {
  const launcher = makeLauncher();

  before(async () => await launcher.launch());
  after(async () => await launcher.kill());

  before(() => overwriteClick());
  before(() => browser.url('/'));

  before(login);

  it('renders negotiation trajectory', () => {
    browser.setTimeout({ script: 120000 });
    openRequestForm();
    requestLoop({
      pointA: 'pantry',
      pointB: 'cubicle_1',
    });
    requestLoop({
      pointA: 'pantry',
      pointB: 'cubicle_2',
    });

    const backButton = $('[aria-label="Back"]');
    backButton.click();

    $('[data-component=MainMenu] [data-item=Negotiations]').click();

    browser.waitUntil(() => $('[data-component=TreeItem]').isDisplayed() === true, {
      timeout: 60000,
      timeoutMsg: 'expected TreeItem to be not null!',
    });
    console.log('done');

    const treeItem = $('[data-component=TreeItem]');
    expect(treeItem).toBeVisible();
    treeItem.click();

    const subTreeItem = treeItem.$('[data-component=TreeItem]');
    expect(subTreeItem).toBeVisible();
    subTreeItem.click();
  });

  // Disabled till we find out a way to locate that floor icon
  // Also figure out a way for a non-rejected negotiation status click

  // it('renders negotiation trajectory', () => {
  //   //$('[data-component=viewOptions]').moveTo();
  //   $('[data-component=NegotiationTrajCheckbox]').click();
  //   expect($('[data-component=RobotTrajectory]')).toBeVisible();
  // });
});
