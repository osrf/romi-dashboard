import {
  bezierControlPoints,
  fromRmfCoords,
  fromRmfYaw,
  getPositionFromSegmentCoefficientsArray,
  radiansToDegrees,
  toRmfCoords,
  toRmfYaw,
  transformMiddleCoordsOfRectToSVGBeginPoint,
} from '../lib';

it('radiansToDegrees', () => {
  const result = radiansToDegrees(Math.PI / 4);
  expect(result).toBeCloseTo(45);
});

it('transformMiddleCoordsOfRectToSVGBeginPoint', () => {
  const result = transformMiddleCoordsOfRectToSVGBeginPoint(1, 1, 2, 2);
  expect(result[0]).toBeCloseTo(0);
  expect(result[0]).toBeCloseTo(0);
});

it('fromRmfCoords', () => {
  const result = fromRmfCoords([1, 1]);
  expect(result[0]).toBe(1);
  expect(result[1]).toBe(-1);
});

it('toRmfCoords', () => {
  const result = toRmfCoords([1, 1]);
  expect(result[0]).toBe(1);
  expect(result[1]).toBe(-1);
});

it('fromRmfYaw', () => {
  const result = fromRmfYaw(Math.PI / 4);
  expect(result).toBeCloseTo(-Math.PI / 4);
});

it('toRmfYaw', () => {
  const result = toRmfYaw(Math.PI / 4);
  expect(result).toBeCloseTo(-Math.PI / 4);
});

it('snapshot - getPositionFromSegmentCoefficientsArray', () => {
  const pos = getPositionFromSegmentCoefficientsArray(5, [
    {
      initialTime: 0,
      finalTime: 10,
      theta: { a: 0, b: 0, c: 0, d: 0 },
      x: { a: 1, b: 1, c: 1, d: 1 },
      y: { a: 2, b: 2, c: 2, d: 2 },
    },
  ])!;
  expect(pos.x).toBeCloseTo(1.875);
  expect(pos.y).toBeCloseTo(3.75);
  expect(pos.theta).toBeCloseTo(0);
});

it('snapshot - bezierControlPoints', () => {
  const points = bezierControlPoints({
    initialTime: 0,
    finalTime: 10,
    theta: { a: 0, b: 0, c: 0, d: 0 },
    x: { a: 1, b: 1, c: 1, d: 1 },
    y: { a: 2, b: 2, c: 2, d: 2 },
  });
  expect(points[0][0]).toBeCloseTo(1);
  expect(points[0][1]).toBeCloseTo(2);
  expect(points[1][0]).toBeCloseTo(1.333);
  expect(points[1][1]).toBeCloseTo(2.667);
  expect(points[2][0]).toBeCloseTo(2);
  expect(points[2][1]).toBeCloseTo(4);
  expect(points[3][0]).toBeCloseTo(4);
  expect(points[3][1]).toBeCloseTo(8);
});
