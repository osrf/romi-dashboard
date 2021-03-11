import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ScheduleVisualizer from '../index';

const mockBuildingMap = {
  name: 'name',
  levels: [
    {
      name: 'name',
      places: [],
      elevation: 1,
      images: [],
      doors: [],
      nav_graphs: [],
      wall_graph: { name: '', vertices: [], edges: [], params: [] },
    },
  ],
  lifts: [],
};

it('renders well with the appropriate data', async () => {
  URL.createObjectURL = jest.fn();

  await waitFor(() => {
    const root = render(
      <ScheduleVisualizer negotiationTrajStore={{}} buildingMap={mockBuildingMap} />,
    );
    root.unmount();
  });
});
