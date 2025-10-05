import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {DragDropModule} from 'primeng/dragdrop';
import {CardModule} from 'primeng/card';
import {OrderListModule} from 'primeng/orderlist';
import {select, Store} from '@ngrx/store';
import {Subject, takeUntil} from 'rxjs';
import {Position, PositionState, StatusLabelEnum} from '../../../generated';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {animate, style, transition, trigger} from '@angular/animations';

import * as positionReducer from '../../core/store/reducers/position.reducer'
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PositionCardComponent} from '../position-card/position-card.component';
import {StatusBoardService} from './status-board.service';
import {ChipModule} from 'primeng/chip';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {SelectOption} from '../position-detail/select-option.interface';
import {FloatLabel} from 'primeng/floatlabel';
import {Select} from 'primeng/select';
import {DatePickerModule} from 'primeng/datepicker';
import {CalendarReminderUnits} from '../../core/domain/calendar-reminder-units';
import {NullityUtilService} from '../../core/utils/nullity-util.service';
import {DateService} from '../../core/services/date.service';


//TODO refactor this component to separate the status board logic from the calendar event logic (maybe create a separate component for the calendar event form)
@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.scss'],
  standalone: true,
  providers: [StatusBoardService],
  imports: [
    NgFor, OrderListModule, CardModule, DragDropModule, CommonModule,
    TranslateModule, PositionCardComponent, ChipModule,
    DialogModule, ReactiveFormsModule, InputTextModule, InputNumberModule,
    DropdownModule, ButtonModule, FloatLabel, Select, DatePickerModule
  ],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'scale(0.95)'}),
        animate('150ms ease-out', style({opacity: 1, transform: 'scale(1)'}))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({opacity: 0, transform: 'scale(0.95)'}))
      ])
    ])
  ]
})
export class StatusBoardComponent implements OnInit, OnDestroy {
  @Input() public positionState: PositionState;

  public positions: { [statusKey: string]: Array<Position> } = {};
  public statusLabels = Object.values(StatusLabelEnum);
  public draggedPosition: Position | undefined;
  public currentDropTarget: string | null = null;


  public showCalendarForm = false;
  public calendarForm: FormGroup;
  public reminderUnits: SelectOption[];
  public selectedCalendarReminderUnit: SelectOption;


  private updatedPosition: Position | null = null;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store,
    private statusBoardService: StatusBoardService,
    private translate: TranslateService,
    private nullityUtilService: NullityUtilService,
    private dateService: DateService,
  ) {
    this.initializeCalendarForm();
    this.statusBoardService.showCalendarForm$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(show => {
      this.showCalendarForm = show;
      if (show) {
        this.initializeEventReminderUnits();
        this.initializeCalendarForm();
      }
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(positionReducer.getPositions), takeUntil(this.unsubscribe$)).subscribe((positions) => {
      if (positions !== undefined) {
        this.positions = positions[this.positionState];
      }
    });
  }

  onDrop(status: string) {
    this.statusBoardService.handlePositionWhenStatusChanged(this.positions, this.draggedPosition!, status);
  }

  getPositionsForStatus(status: StatusLabelEnum): Position[] {
    return this.positions[status] || [];
  }

  public findStatusLabelFromValue(literalStatusValue: string): StatusLabelEnum {
    return this.statusBoardService.findStatusLabelFromValue(literalStatusValue);
  }

  public isPositionsEmpty(): boolean {
    return Object.values(this.positions).every(arr => arr.length === 0);
  }

  onDragStart(position: Position) {
    this.draggedPosition = position;
  }

  onDragEnd(status: String) {
    this.currentDropTarget = null;
  }

  onDragEnter(status: string) {
    this.currentDropTarget = status;
  }

  onDragLeave(status: string) {
    if (this.currentDropTarget === status) {
      this.currentDropTarget = null;
    }
  }

  onCalendarFormHide() {
    this.showCalendarForm = false;
    if (this.updatedPosition) {
      this.statusBoardService.handlePositionWhenStatusChanged(
        this.positions,
        this.updatedPosition,
        this.updatedPosition.statuses![this.updatedPosition.statuses!.length - 1].label!
      );
    }
  }

  onSubmitCalendarEvent() {
    if (this.calendarForm.valid) {
      const formValue = this.calendarForm.value;
      let reminderMinutes: number | undefined;

      if (formValue.reminderValue) {
        switch (formValue.reminderUnit.value) {
          case CalendarReminderUnits.Minutes:
            reminderMinutes = formValue.reminderValue;
            break;
          case CalendarReminderUnits.Hours:
            reminderMinutes = formValue.reminderValue * 60;
            break;
          case CalendarReminderUnits.Days:
            reminderMinutes = formValue.reminderValue * 24 * 60;
            break;
        }
      }

      const calendarEvent = {
        eventName: formValue.eventName,
        startDateTime: this.dateService.toApiDateTime(formValue.startDateTime)!.toString(),
        endDateTime: this.dateService.toApiDateTime(formValue.endDateTime)!.toString(),
        location: formValue.location || undefined,
        description: formValue.description || undefined,
        reminderMinutesBefore: reminderMinutes
      };

      this.statusBoardService.createCalendarEvent(calendarEvent);
    }
  }

  public onReminderUnitChange($event: any) {
    this.selectedCalendarReminderUnit = $event.value;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeEventReminderUnits() {
    if (this.nullityUtilService.isNotNullOrUndefined(this.reminderUnits) && this.reminderUnits.length > 0) {
      return; // Avoid re-initialization if already set
    }
    this.translate.get(['calendarEvent.minutes',
      'calendarEvent.hours',
      'calendarEvent.days']).subscribe((res) => {
        this.reminderUnits = [];
        this.reminderUnits.push({label: res['calendarEvent.minutes'], value: CalendarReminderUnits.Minutes})
        this.reminderUnits.push({label: res['calendarEvent.hours'], value: CalendarReminderUnits.Hours})
        this.reminderUnits.push({label: res['calendarEvent.days'], value: CalendarReminderUnits.Days})
      }
    );
  };

  private initializeCalendarForm() {

    this.calendarForm = new FormGroup({
      eventName: new FormControl('', Validators.required),
      startDateTime: new FormControl(null, Validators.required),
      endDateTime: new FormControl(null, Validators.required),
      location: new FormControl(''),
      description: new FormControl(''),
      reminderValue: new FormControl(1, Validators.required),
      reminderUnit: new FormControl('')
    });
  }
}
