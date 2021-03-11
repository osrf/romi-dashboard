export { Door } from './generated/door';
export { DoorHealth } from './generated/door-health';
export { DoorState } from './generated/door-state';
import type {
  AffineImage as BaseAffineImage,
  BuildingMap as BaseBuildingMap,
  Level as BaseLevel,
} from '@osrf/romi-js-core-interfaces';

export interface AffineImage extends Omit<BaseAffineImage, 'data'> {
  data: string;
}

export interface Level extends Omit<BaseLevel, 'images'> {
  images: AffineImage[];
}

export interface BuildingMap extends Omit<BaseBuildingMap, 'levels'> {
  levels: Level[];
}
