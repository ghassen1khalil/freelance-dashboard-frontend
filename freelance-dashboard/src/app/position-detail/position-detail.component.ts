import {Component, computed, effect, OnDestroy, OnInit, Signal, signal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Currency, Position, PositionState} from '../../../generated';
import {Subject, takeUntil} from 'rxjs';
import {PositionDetailUtilService} from './position-detail-util.service';
import {Drawer} from 'primeng/drawer';
import {select, Store} from '@ngrx/store';
import {getPositionDetailsDrawer} from '../../core/store/reducers/position-details-drawer.reducers';
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
import {UpdatePosition} from '../../core/store/actions/position.actions';
import {ConfirmationService} from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';



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
    ConfirmDialog
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
  public isEditMode: boolean = true;

  public options: SelectOption[] = [];
  public selectedOption: SelectOption;

  protected readonly PositionState = PositionState;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store,
              protected positionDetailUtil: PositionDetailUtilService,
              private confirmationService: ConfirmationService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.options = this.positionDetailUtil.generateOptions();
    this.store.pipe(
      select(getPositionDetailsDrawer),
      takeUntil(this.unsubscribe$)
    ).subscribe(state => {
      this.isDrawerVisible = state.isDrawerShown;
      this.position = state.position!;
      this.positionForm = this.positionDetailUtil.initPositionFormGroup(this.position);
    });
  }

  public hasFormChanged(): boolean {
    return this.positionForm && this.positionForm.dirty;
  }

  public closeDrawer(): void {
    this.isDrawerVisible = false;
  }

  public onChange(event: any): void {
    this.selectedOption = {
      label: this.options.filter(option => event.value === option.value)[0].label,
      value: event.value
    };
  }

  public switchPositionState(): void {
    this.store.dispatch(
      UpdatePosition({
        position: this.positionDetailUtil.updatePositionState(this.position, undefined)
      })
    );
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
        },
        reject: () => {
          this.confirmationService.close();
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

}
