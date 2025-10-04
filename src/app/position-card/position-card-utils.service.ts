import {Injectable} from '@angular/core';
import {Position} from '../../../generated';

@Injectable({
  providedIn: 'root'
})
export class PositionCardUtilsService {

  constructor() {
  }

  public getMostRecentStatusLabel(position: Position): string | undefined {
    if (!position.statuses || position.statuses.length === 0) {
      return undefined;
    }

    // Sort statuses by date in descending order
    const sortedStatuses = [...position.statuses].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // Return the label of the most recent status
    return sortedStatuses[0].label;
  }

}
