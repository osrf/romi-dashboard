import { Element } from '@wdio/sync';
import { makeLauncher } from '../../rmf-launcher';
import { login, overwriteClick } from './utils';

describe('door request', () => {
  let doorAccordion: Element;
  const launcher = makeLauncher();

  before(async () => await launcher.launch());
  after(async () => await launcher.kill());

  before(() => overwriteClick());
  before(() => browser.url('/'));

  before(login);

  before(() => {
    $('[data-component=MainMenu] [data-item=Doors]').click();
    doorAccordion = $('.MuiAccordion-root*=main_door');
    doorAccordion.click();
  });

  it('clicking on open button opens the door', () => {
    doorAccordion.$('button=Open').click();
    expect(doorAccordion.$('[role=status]')).toHaveText('OPEN');
  });

  it('clicking on close button closes the door', () => {
    doorAccordion.$('button=Close').click();
    expect(doorAccordion.$('[role=status]')).toHaveText('CLOSED');
  });
});
