import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DoorAccordion as DoorAccordion_, useSpotlightRef, withSpotlight } from '../lib';
import { makeDoor } from './doors/test-utils';

const DoorAccordion = withSpotlight(DoorAccordion_);

it('clicking on the accordion expands it', () => {
  const door = makeDoor();
  const root = render(<DoorAccordion door={door} />);
  userEvent.click(root.getByText(door.name, { selector: 'h6' }));
  expect(root.container.querySelector('[aria-expanded=true]')).toBeTruthy();
});

it('spotlight opens the accordion', () => {
  const TestComponent = () => {
    return <DoorAccordion ref={(ref) => ref?.spotlight()} door={makeDoor()} />;
  };

  const root = render(<TestComponent />);
  expect(root!.container.querySelector('[aria-expanded=true]')).toBeTruthy();
});

it('spotlight ref defers spotlight call until component is mounted', () => {
  const TestComponent = () => {
    const spotlightRef = useSpotlightRef();
    spotlightRef.current.spotlight();
    return <DoorAccordion ref={spotlightRef.current.ref} door={makeDoor()} />;
  };
  const root = render(<TestComponent />);
  expect(root!.container.querySelector('[aria-expanded=true]')).toBeTruthy();
});
