import {Localisation} from './localisation';
import {Intermediary} from './intermediary';

export interface Position {
  year: number;
  client: string;
  projectOrEntity: string;
  localisation: Localisation;
  intermediary: Intermediary;
  statusHistory: string[];
  remarks: string;
}
