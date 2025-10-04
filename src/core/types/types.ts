import {Position} from '../../../generated';

export type PositionsByStatus = {
  [statusKey: string]: Position[];
};
