import {Injectable} from '@angular/core';
import {CalendarEventService, Position, Status, StatusLabelEnum} from '../../../generated';
import {PositionsByStatus} from '../../core/types/types';
import {UpdatePosition} from '../../core/store/actions/position.actions';
import {Store} from '@ngrx/store';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {CalendarEvent} from '../../core/domain/calendar-event';
import {DateService} from '../../core/services/date.service';

@Injectable({
  providedIn: 'root',
})

// TODO refactor this service to separate the status board logic from the calendar event logic
export class StatusBoardService {
  private showCalendarForm = new Subject<boolean>();
  showCalendarForm$ = this.showCalendarForm.asObservable();

  constructor(private store: Store,
              private confirmationService: ConfirmationService,
              private calendarEventService: CalendarEventService,
              private dateService: DateService,
              private translate: TranslateService) {}

  public handlePositionWhenStatusChanged(positions: PositionsByStatus, draggedPosition: Position, targetedStatusLiteralValue: string): PositionsByStatus {
    const latestStatus = this.getLatestStatus(draggedPosition!);
    const targetStatus = this.buildTargetStatus(targetedStatusLiteralValue);
    const draggedPositionIndex = this.getDraggedPositionIndexFromStatusColumn(positions, draggedPosition, latestStatus);
    if (latestStatus.label !== targetStatus.label) {
      let updatedPosition = this.buildUpdatedPositions(draggedPosition!, targetStatus);
      positions = {
        ...positions,
        [latestStatus.label!]: [...this.removedDraggedPositionFromPreviousStatusColumn(positions[latestStatus.label!], draggedPositionIndex)],
        [targetStatus.label!]: [...(positions[targetStatus.label!] || []), updatedPosition],
      };

      if (StatusLabelEnum.ResponseReceived === targetedStatusLiteralValue) {
        this.showIsFreelancerAcceptedConfirmationDialog(updatedPosition, targetedStatusLiteralValue);
      } else if (StatusLabelEnum.InterviewPlanned === targetedStatusLiteralValue) {
        this.showGenerateCalendarEventConfirmationDialog(updatedPosition, targetedStatusLiteralValue);
      } else {
        this.store.dispatch(UpdatePosition({position: this.setIsFreelancerAccepted(updatedPosition, false)}));
      }
    }
    return positions;
  }

  public findStatusLabelFromValue(literalStatusValue: string): StatusLabelEnum {
    for (const key in StatusLabelEnum) {
      if (StatusLabelEnum[key as keyof typeof StatusLabelEnum] === literalStatusValue) {
        return StatusLabelEnum[key as keyof typeof StatusLabelEnum];
      }
    }
    throw new Error('Invalid StatusLabelEnum value: ' + literalStatusValue);
  }

  private getLatestStatus(draggedPosition: Position): Status {
    return draggedPosition!.statuses![draggedPosition!.statuses!.length - 1];
  }

  private buildTargetStatus(status: string): Status {
    return {
      label: this.findStatusLabelFromValue(status),
      date: this.dateService.toApiDateTime(new Date())?.toString()
    };
  }

  private getDraggedPositionIndexFromStatusColumn(positions: {
    [statusKey: string]: Array<Position>
  }, draggedPosition: Position, status: Status): number {
    return positions[status.label!].findIndex(pos => pos.id === draggedPosition!.id);
  }

  private buildUpdatedPositions(draggedPosition: Position, targetStatus: Status): Position {
    return {
      ...draggedPosition, statuses: [...draggedPosition!.statuses!, targetStatus]
    };
  }

  private removedDraggedPositionFromPreviousStatusColumn(listOfPositions: Position[], index: number) {
    const updatedPositions = [...listOfPositions];
    updatedPositions.splice(index, 1);
    return updatedPositions;
  }

  private showIsFreelancerAcceptedConfirmationDialog = (updatedPosition: Position, status: string) => {
    this.translate.get(['areYouAccepted', 'areYouAcceptedHeader', 'yes', 'no']).subscribe(res => {
      this.confirmationService.confirm({
        message: res['areYouAccepted'], header: res['areYouAcceptedHeader'], icon: 'pi pi-info-circle', accept: () => {
          this.store.dispatch(UpdatePosition({
            position: this.setIsFreelancerAccepted(updatedPosition, true)
          }));
        }, reject: () => {
          this.store.dispatch(UpdatePosition({
            position: this.setIsFreelancerAccepted(updatedPosition, false),
          }));
        }
      });
    });
  }

  private setIsFreelancerAccepted(updatedPosition: Position, isFreelancerAccepted: boolean): Position {
    return {
      ...updatedPosition, 'isFreelancerAccepted': isFreelancerAccepted,
    };
  }

  createCalendarEvent(eventData: CalendarEvent) {
    this.calendarEventService.generateIcsFile(eventData).subscribe({
      next: (result) => {
        const downloadURL = window.URL.createObjectURL(result);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `event.ics`;
        link.click();
        URL.revokeObjectURL(downloadURL);
      },
      error: (error) => {
        console.error(error);
      }
    })

    // Hide the calendar form
    this.showCalendarForm.next(false);
  }

  private showGenerateCalendarEventConfirmationDialog = (updatedPosition: Position, status: string) => {
    this.translate.get(['generateCalendarEventHeader', 'generateCalendarEventMessage', 'yes', 'no']).subscribe(res => {
      this.confirmationService.confirm({
        message: res['generateCalendarEventMessage'],
        header: res['generateCalendarEventHeader'],
        icon: 'pi pi-calendar',
        accept: () => {
          // Show calendar form dialog
          this.showCalendarForm.next(true);
          // Position update will be handled after calendar event creation
        },
        reject: () => {
          // User doesn't want to generate a calendar event

        }
      });

      this.store.dispatch(UpdatePosition({
        position: updatedPosition
      }));
    });
  }
}
