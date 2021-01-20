import { act, render, RenderResult } from '@testing-library/react';

/**
 * Wraps a `render` in a `act`.
 */
export async function renderAct(ui: React.ReactElement): Promise<RenderResult> {
  let root: RenderResult;
  await act(async () => {
    root = render(ui);
  });
  return root!;
}
