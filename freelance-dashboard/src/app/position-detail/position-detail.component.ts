import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Currency, Note, Position, PositionsService, PositionState} from '../../../generated';
import {Subject, takeUntil} from 'rxjs';
import {PositionDetailUtilService} from './position-detail-util.service';
import {Drawer} from 'primeng/drawer';
import {select, Store} from '@ngrx/store';
import {getPositionDetailsDrawer} from '../../core/store/reducers/position-details-drawer.reducers';
import {getAuth} from '../../core/store/reducers/auth.reducers';
import {Button, ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {Fieldset} from 'primeng/fieldset';
import {InputText} from 'primeng/inputtext';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FloatLabel} from 'primeng/floatlabel';
import {DatePicker, DatePickerModule} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import * as PositionActions from '../../core/store/actions/position.actions';
import {UpdatePosition} from '../../core/store/actions/position.actions';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {Editor} from 'primeng/editor';
import {NgIf} from '@angular/common';
import {Divider} from 'primeng/divider';
import {DateService} from '../../core/services/date.service';
import {Timeline} from 'primeng/timeline';
import {ClosePositionDetailsDrawer,} from '../../core/store/actions/position-details-drawer.actions';

//TODO this component should be refactored because it is too big and has too many responsibilities (CREATION, EDITING, DELETION, GENERATION of followup email, NOTES management, etc.)
@Component({
  selector: 'app-position-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Drawer,
    Button,
    DropdownModule,
    Fieldset,
    InputText,
    TranslatePipe,
    FloatLabel,
    DatePicker,
    Select,
    ConfirmDialog,
    Dialog,
    Editor,
    FormsModule,
    NgIf,
    Divider,
    Timeline,
    ButtonDirective,
    DatePickerModule
  ],
  templateUrl: './position-detail.component.html',
  styleUrl: './position-detail.component.scss',
  providers: [PositionDetailUtilService, ConfirmationService]
})
export class PositionDetailComponent implements OnInit, OnDestroy{

  public position: Position;
  public positionForm: FormGroup;
  public isDrawerVisible = false;
  public currencies: string[] = Object.values(Currency);
  public isCreation: boolean;

  public isFollowupEmailEditorVisible: boolean = false;
  public emailBody: string | undefined;
  public notes = signal<Note[]>([]);

  private freelancerId: string | undefined;

  protected readonly PositionState = PositionState;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store,
              protected positionDetailUtil: PositionDetailUtilService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService,
              private positionService: PositionsService,
              private dateService: DateService) {
  }

  ngOnInit(): void {
    //Only when EDITING an existing position, the position is fetched from the store
    if (!this.isCreation) {
      this.store.pipe(
        select(getPositionDetailsDrawer),
        takeUntil(this.unsubscribe$)
      ).subscribe(state => {
        this.isCreation = state.isCreation;
        this.isDrawerVisible = state.isDrawerShown;
        this.position = state.position!;
        this.positionForm = this.positionDetailUtil.initPositionFormGroup(this.position);
      });
    }


    this.store.pipe(
      select(getAuth),
      takeUntil(this.unsubscribe$)
    ).subscribe(authState => {
      if (authState.freelancer) {
        this.freelancerId = authState.freelancer.id;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public isButtonShown(button: string): boolean {
    if (button === 'save') {
      return this.isCreation;
    }
    if (button === 'update') {
      return !this.isCreation  && !this.positionForm.pristine;
    }
    if (button === 'delete') {
      return !this.isCreation;
    }
    if (button === 'generate') {
      return !this.isCreation
    }
    return false;
  }

  public savePosition() {
    if (this.positionForm.valid) {
      const position = this.positionDetailUtil.createPositionFromForm(false, this.positionForm, this.position);
      position.freelancerId = this.freelancerId;
      position.notes = this.notes() ?? [];
      this.store.dispatch(PositionActions.SavePosition({
        position: position
      }));
      this.closeDrawer();
    }
  }

  public updatePosition() {
    this.positionDetailUtil.updatePosition(this.positionForm, this.position);
    this.closeDrawer();
  }


  public confirmDeletion() {
    this.translate.get([
      'delete-modal.position.areYouSure',
      'delete-modal.confirmation',
      'delete-modal.confirmed',
      'delete-modal.rejected',
      'delete-modal.cancelled',
    ]).subscribe(res => {
      this.confirmationService.confirm({
        message: res['delete-modal.position.areYouSure'],
        header: res['delete-modal.confirmation'],
        icon: 'pi pi-info-circle',
        key: 'confirmDeletion',
        accept: () => {
          this.store.dispatch(UpdatePosition({position: this.positionDetailUtil.updatePositionState(this.position, PositionState.Deleted)}));
          this.closeDrawer();
        },
        reject: () => {
          this.confirmationService.close();
        },
      });
    });
  }

  private closeDrawer() {
    this.isDrawerVisible = false
  }

  public generateFollowupMail() {
    //this.store.dispatch(GenerateFollowupMail({positionId: this.position.id!}));

    this.positionService.generateFollowupMail(this.position.id!).subscribe(
      messageBody => {
        this.emailBody = messageBody;
        this.isFollowupEmailEditorVisible = true;
      }
    );

    /*this.emailBody = "<p>Test<br>Test</p>";
    this.isFollowupEmailEditorVisible = true;*/

  }

  public onEnter() {
    if (!this.isCreation) {
      this.position = this.addNoteToPosition();
      this.store.dispatch(UpdatePosition({position: this.position}));
    } else {
      this.notes.update(notes => [...notes, this.createNoteFromForm()]);
    }
    this.resetNoteInput();
  }

  private addNoteToPosition(): Position {
    return {
      ...this.position,
      notes: [
        ...(this.position.notes ?? []),
        this.createNoteFromForm()
      ]
    };
  }

  private resetNoteInput() {
    this.positionForm.get('note')?.setValue('');
  }

  /**
   * Format the date for display in the timeline
   * @param dateString The date string to format
   * @returns Formatted date string
   */
  public formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return this.dateService.format(dateString, 'MMM D, YYYY HH:mm');
  }

  /**
   * Delete a note from the position
   * @param index The index of the note to delete
   */
  public deleteNote(note: Note): void {
    if (!this.position.notes || this.position.notes.length === 0) return;

    const noteIndex = this.position.notes.findIndex(n =>
      n.content === note.content && n.addedOn === note.addedOn
    );

    if (noteIndex === -1) return;

    const updatedNotes = [...this.position.notes];
    updatedNotes.splice(noteIndex, 1);

    const updatedPosition = {
      ...this.position,
      notes: updatedNotes
    };

    this.position = updatedPosition;
    this.store.dispatch(UpdatePosition({position: updatedPosition}));
  }

  private createNoteFromForm(): Note {
    return {
      content: this.positionForm.get('note')?.value,
      addedOn: this.dateService.today(DateService.YYYY_MM_DD_HH_MM_FORMAT)
    };
  }

  public onDismiss() {
    this.isDrawerVisible = false;
    this.store.dispatch(ClosePositionDetailsDrawer())
    this.notes.set([]);
  }
}
