import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionComponent} from './position.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FieldsetModule} from 'primeng/fieldset';
import {RippleModule} from 'primeng/ripple';
import {TimelineModule} from 'primeng/timeline';
import {CalendarModule} from 'primeng/calendar';
import {PositionRoutingModule} from './position-routing.module';
import {DropdownModule} from 'primeng/dropdown';
import {TextareaModule} from 'primeng/textarea';


@NgModule({
  declarations: [
    PositionComponent
  ],
  exports: [
    PositionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TranslateModule,
    ButtonModule,
    CheckboxModule,
    ToggleButtonModule,
    FormsModule,
    FieldsetModule,
    RippleModule,
    TextareaModule,
    TimelineModule,
    CalendarModule,
    PositionRoutingModule,
    DropdownModule,
  ]
})
export class PositionModule {
}
