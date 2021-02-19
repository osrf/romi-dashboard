import { makeLauncher } from '../../rmf-launcher';
import { getRobotLocations, login, overwriteClick, removeTextFromAutocomplete } from './utils';

describe('Delivery request', () => {
  const launcher = makeLauncher();

  before(async () => await launcher.launch());
  after(async () => await launcher.kill());

  before(() => overwriteClick());
  before(() => browser.url('/'));

  before(login);

  it('rmf responds to delivery request', () => {
    $('[data-component=MainMenu] [data-item=Robots]').click();

    const currentRobotLocations = getRobotLocations(browser);

    const backButton = $('[aria-label="Back"]');
    backButton.click();
    $('[data-component=MainMenu] [data-item=Commands]').click();
    const deliveryForm = $('[data-component=DeliveryRequestForm]');
    deliveryForm.click();
    const pickupPlaceInput = deliveryForm.$('input[placeholder="Pick Start Location"]');
    pickupPlaceInput.waitForClickable();
    pickupPlaceInput.setValue(removeTextFromAutocomplete(20));
    pickupPlaceInput.waitForClickable();
    pickupPlaceInput.setValue('pantry');
    $('.MuiAutocomplete-popper').click();

    deliveryForm.$('input[placeholder="Pickup Dispenser"]').click();
    $('.MuiAutocomplete-popper').click();

    const dropoffPlaceInput = deliveryForm.$('input[placeholder="Pick Drop Off Location"]');
    dropoffPlaceInput.waitForClickable();
    dropoffPlaceInput.setValue(removeTextFromAutocomplete(20));
    dropoffPlaceInput.waitForClickable();
    dropoffPlaceInput.setValue('hardware_2');
    $('.MuiAutocomplete-popper').click();

    deliveryForm.$('input[placeholder="Pick Drop Off Dispenser"]').click();
    $('.MuiAutocomplete-popper').click();

    const requestButton = deliveryForm.$('button=Request');
    requestButton.scrollIntoView();
    requestButton.click();

    backButton.click();
    $('[data-component=MainMenu] [data-item=Robots]').click();
    const newRobotLocations = getRobotLocations(browser);

    expect(newRobotLocations).not.toMatchObject(currentRobotLocations);
  });

  it('renders robot trajectory', () => {
    expect($('[data-component=TrajectoryMarker]')).toBeVisible();
  });
});
