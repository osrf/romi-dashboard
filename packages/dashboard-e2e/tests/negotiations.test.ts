/**
 * Temporarily disabled as negotiations panel
 * main menu button is disabled
 */

// import { makeLauncher } from '../../dashboard/rmf-launcher';
// import { login, overwriteClick } from './utils';
// import { execSync } from 'child_process';

// describe('Loop request for negotiations', () => {
//   const launcher = makeLauncher();

//   before(async () => await launcher.launch());
//   after(async () => await launcher.kill());

//   before(() => overwriteClick());
//   before(() => browser.url('/'));

//   before(login);

//   it('renders negotiation trajectory', () => {
//     browser.setTimeout({ script: 120000 });
//     execSync('ros2 launch rmf_demos office_conflict.launch.xml');

//     $('[data-component=MainMenu] [data-item=Negotiations]').click();

//     browser.waitUntil(() => $('[data-component=TreeItem]').isDisplayed() === true, {
//       timeout: 60000,
//       timeoutMsg: 'expected TreeItem to be not null!',
//     });
//     console.log('done');

//     const treeItem = $('[data-component=TreeItem]');
//     expect(treeItem).toBeVisible();
//     treeItem.click();

//     const subTreeItem = treeItem.$('[data-component=TreeItem]');
//     expect(subTreeItem).toBeVisible();
//     subTreeItem.click();
//   }).timeout(300000);

// Disabled till we find out a way to locate that floor icon
// Also figure out a way for a non-rejected negotiation status click

// it('renders negotiation trajectory', () => {
//   //$('[data-component=viewOptions]').moveTo();
//   $('[data-component=NegotiationTrajCheckbox]').click();
//   expect($('[data-component=RobotTrajectory]')).toBeVisible();
// });
// });
