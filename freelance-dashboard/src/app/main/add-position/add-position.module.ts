import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPositionComponent } from './add-position.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FieldsetModule} from 'primeng/fieldset';
import {RippleModule} from 'primeng/ripple';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TimelineModule} from 'primeng/timeline';



@NgModule({
  declarations: [
    AddPositionComponent
  ],
  exports: [
    AddPositionComponent
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
    InputTextareaModule,
    TimelineModule
  ]
})
export class AddPositionModule { }
