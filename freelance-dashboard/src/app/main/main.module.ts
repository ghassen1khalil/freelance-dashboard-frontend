import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutingModule} from './main-routing.module';
import {TableModule} from 'primeng/table';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {DialogModule} from 'primeng/dialog';
import {AddPositionModule} from '../add-position/add-position.module';
import {CardModule} from 'primeng/card';
import {MenuModule} from 'primeng/menu';
import {AccordionModule} from '../../partials/components/accordion/accordion.module';


@NgModule({
  declarations: [
    MainComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    TableModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DialogModule,
    AddPositionModule,
    CardModule,
    MenuModule,
    AccordionModule
  ]
})
export class MainModule {
}
