import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Currency, Note, Position, PositionsService, PositionState} from '../../../generated';
import {Subject, takeUntil} from 'rxjs';
import {PositionDetailUtilService} from './position-detail-util.service';
import {Drawer} from 'primeng/drawer';
import {select, Store} from '@ngrx/store';
import {getPositionDetailsDrawer} from '../../core/store/reducers/position-details-drawer.reducers';
import {getAuth} from '../../core/store/reducers/auth.reducers';
import {getAllSkills} from '../../core/store/reducers/skills.reducers';
import {Button, ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {Fieldset} from 'primeng/fieldset';
import {InputText} from 'primeng/inputtext';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FloatLabel} from 'primeng/floatlabel';
import {DatePickerModule} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {SelectOption} from './select-option.interface';
import * as PositionActions from '../../core/store/actions/position.actions';
import {UpdatePosition} from '../../core/store/actions/position.actions';
import * as SkillsActions from '../../core/store/actions/skills.actions';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {Editor} from 'primeng/editor';
import {NgFor, NgIf} from '@angular/common';
import {Divider} from 'primeng/divider';
import {DateService} from '../../core/services/date.service';
import {Timeline} from 'primeng/timeline';
import {ClosePositionDetailsDrawer,} from '../../core/store/actions/position-details-drawer.actions';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TagModule} from 'primeng/tag';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {PrimePhoneInputComponent} from '../components/phone/prime-phone-input.component';

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
    Select,
    ConfirmDialog,
    Dialog,
    Editor,
    FormsModule,
    NgIf,
    NgFor,
    Divider,
    Timeline,
    ButtonDirective,
    DatePickerModule,
    AutoCompleteModule,
    TagModule,
    ToggleSwitch,
    PrimePhoneInputComponent
  ],
  templateUrl: './position-detail.component.html',
  styleUrl: './position-detail.component.scss',
  providers: [PositionDetailUtilService, ConfirmationService]
})
export class PositionDetailComponent implements OnInit, OnDestroy {

  public position: Position;
  public positionForm: FormGroup;
  public isDrawerVisible = false;
  public currencies: string[] = Object.values(Currency);
  public isCreation: boolean;

  public remoteDaysOptions: SelectOption[] = [];
  public remoteDaysSelectedOption: SelectOption;

  // Skills autocomplete data
  public allSkills: string[] = [];
  public filteredSkills: string[] = [];

  public isFollowupEmailEditorVisible: boolean = false;
  public emailBody: string | undefined;
  public notes = signal<Note[]>([]);
  public followupRegenerationsLeft = 0;
  protected readonly PositionState = PositionState;
  private freelancerId: string | undefined;
  private unsubscribe$ = new Subject<void>();
  // Follow-up email generation limits
  private maxFollowupRegenerations = 5;

  constructor(private store: Store,
              protected positionDetailUtil: PositionDetailUtilService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService,
              private positionService: PositionsService,
              private dateService: DateService) {
  }

  ngOnInit(): void {
    this.remoteDaysOptions = this.positionDetailUtil.generateRemoteDaysOptions();
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

        // Apply and react to intermediary toggle validators
        this.positionDetailUtil.applyIntermediaryValidators(this.positionForm);
        this.positionForm.get('hasIntermediary')?.valueChanges
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => this.positionDetailUtil.applyIntermediaryValidators(this.positionForm));

        // Apply and react to planned starting date toggle validators
        this.positionDetailUtil.applyStartingDateValidators(this.positionForm);
        this.positionForm.get('hasPlannedStartingDate')?.valueChanges
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(() => this.positionDetailUtil.applyStartingDateValidators(this.positionForm));

        const mission = this.position?.mission;
        if (mission) {
          this.store.dispatch(SkillsActions.LoadSkills({
            role: mission.role,
            project: mission.project,
            team: mission.team
          }));
        }
      });
    }


    // Subscribe to skills from store
    this.store.pipe(
      select(getAllSkills),
      takeUntil(this.unsubscribe$)
    ).subscribe(skills => {
      this.allSkills = skills ?? [];
    });

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
      return !this.isCreation && !this.positionForm.pristine;
    }
    if (button === 'delete') {
      return !this.isCreation;
    }
    if (button === 'generate') {
      return !this.isCreation
    }
    return false;
  }

  public onRemoteDaysSelectedOptionChange(event: any): void {
    this.remoteDaysSelectedOption = {
      label: this.remoteDaysOptions.filter(option => event.value === option.value)[0].label,
      value: event.value
    };
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

  public generateFollowupMail(isRegeneration: boolean = false) {
    // Persist remaining regenerations per position across the whole app using localStorage
    const positionId = this.position?.id;
    const storageKey = positionId ? `followupRegenerationsLeft:${positionId}` : 'followupRegenerationsLeft:unknown';

    if (isRegeneration) {
      // Always sync from storage before deciding
      const stored = localStorage.getItem(storageKey);
      const parsed = stored !== null ? parseInt(stored, 10) : this.followupRegenerationsLeft;
      this.followupRegenerationsLeft = Number.isNaN(parsed) ? 0 : parsed;

      if (this.followupRegenerationsLeft <= 0) {
        return;
      }
    } else {
      // On first generation, load from storage if exists; otherwise initialize to max and persist
      const stored = localStorage.getItem(storageKey);
      const parsed = stored !== null ? parseInt(stored, 10) : NaN;
      if (Number.isNaN(parsed)) {
        this.followupRegenerationsLeft = this.maxFollowupRegenerations;
        localStorage.setItem(storageKey, String(this.followupRegenerationsLeft));
      } else {
        this.followupRegenerationsLeft = parsed;
      }
    }

    this.positionService.generateFollowupMail(this.position).subscribe(
      messageBody => {
        this.emailBody = messageBody;
        this.isFollowupEmailEditorVisible = true;
        if (isRegeneration) {
          this.followupRegenerationsLeft = Math.max(0, this.followupRegenerationsLeft - 1);
          localStorage.setItem(storageKey, String(this.followupRegenerationsLeft));
        }
      }
    );
  }

  // ===== Skills handlers =====
  public filterSkills(event: any) {
    const query = (event.query ?? '').toLowerCase();
    this.filteredSkills = this.allSkills.filter(s => s.toLowerCase().includes(query));
  }

  public onSkillSelect(event: any) {
    this.addSkill(event?.value ?? '');
  }

  public onSkillEnter() {
    const value = this.positionForm.get('skillInput')?.value;
    this.addSkill(value);
  }

  public removeSkill(skill: string) {
    const current: string[] = this.positionForm.get('skills')?.value ?? [];
    const updated = current.filter(s => s.toLowerCase() !== skill.toLowerCase());
    this.positionForm.get('skills')?.setValue(updated);
    this.positionForm.markAsDirty();
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

  /**
   * Format the date for display in the timeline
   * @param dateString The date string to format
   * @returns Formatted date string
   */
  public formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return this.dateService.toDisplayDateTime(dateString)!.toString();
  }

  /**
   * Get notes sorted by addedOn in descending order (newest first)
   * @returns Sorted notes array
   */
  public getSortedNotes(): Note[] {
    const notesCopy = [...this.notes()];
    return notesCopy.sort((a, b) => {
      if (!a.addedOn || !b.addedOn) return 0;
      return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime();
    });
  }

  /**
   * Get position notes sorted by addedOn in descending order (newest first)
   * @returns Sorted position notes array
   */
  public getSortedPositionNotes(): Note[] {
    if (!this.position.notes) return [];
    const notesCopy = [...this.position.notes];
    return notesCopy.sort((a, b) => {
      if (!a.addedOn || !b.addedOn) return 0;
      return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime();
    });
  }

  /**
   * Delete a note from the position
   * @param note
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

  public onDismiss() {
    this.isDrawerVisible = false;
    this.store.dispatch(ClosePositionDetailsDrawer())
    this.notes.set([]);
  }

  private closeDrawer() {
    this.isDrawerVisible = false
  }

  private addSkill(value: string) {
    const v = (value ?? '').trim();
    if (!v) return;
    const current: string[] = this.positionForm.get('skills')?.value ?? [];
    if (current.map(x => x.toLowerCase()).includes(v.toLowerCase())) {
      // already exists, just clear input
      this.positionForm.get('skillInput')?.setValue('');
      return;
    }
    const updated = [...current, v];
    this.positionForm.get('skills')?.setValue(updated);
    this.positionForm.get('skillInput')?.setValue('');
    this.positionForm.markAsDirty();
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

  private createNoteFromForm(): Note {
    return {
      content: this.positionForm.get('note')?.value,
      addedOn: this.dateService.toApiDateTime(new Date())?.toString()
    };
  }
}
