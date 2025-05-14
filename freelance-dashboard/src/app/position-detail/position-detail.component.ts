import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Currency, Position, PositionsService, PositionState} from '../../../generated';
import {Subject, takeUntil} from 'rxjs';
import {PositionDetailUtilService} from './position-detail-util.service';
import {Drawer} from 'primeng/drawer';
import {select, Store} from '@ngrx/store';
import {getPositionDetailsDrawer} from '../../core/store/reducers/position-details-drawer.reducers';
import {getAuth} from '../../core/store/reducers/auth.reducers';
import {Button} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {Fieldset} from 'primeng/fieldset';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FloatLabel} from 'primeng/floatlabel';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {SelectOption} from './select-option.interface';
import * as PositionActions from '../../core/store/actions/position.actions';
import {UpdatePosition} from '../../core/store/actions/position.actions';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {Editor} from 'primeng/editor';


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
    Textarea,
    TranslatePipe,
    FloatLabel,
    DatePicker,
    Select,
    ConfirmDialog,
    Dialog,
    Editor,
    FormsModule
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

  public remoteDaysOptions: SelectOption[] = [];
  public remoteDaysSelectedOption: SelectOption;

  public isFollowupEmailEditorVisible: boolean = false;
  public emailBody: string | undefined;

  private freelancerId: string | undefined;

  protected readonly PositionState = PositionState;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store,
              protected positionDetailUtil: PositionDetailUtilService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService,
              private positionService: PositionsService) {}

  ngOnInit(): void {
    this.remoteDaysOptions = this.positionDetailUtil.generateRemoteDaysOptions();
    this.store.pipe(
      select(getPositionDetailsDrawer),
      takeUntil(this.unsubscribe$)
    ).subscribe(state => {
      this.isCreation = state.isCreation;
      this.isDrawerVisible = state.isDrawerShown;
      this.position = state.position!;
      this.positionForm = this.positionDetailUtil.initPositionFormGroup(this.position);
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

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }
}
