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
import {AddPositionModule} from './add-position/add-position.module';
import { PositionCardComponent } from './position-card/position-card.component';
import {CardModule} from 'primeng/card';
import {AccordionModule} from 'primeng/accordion';
import {DashboardAccordionModule} from '../../shared/accordion/dashboard-accordion.module';


@NgModule({
  declarations: [
    MainComponent,
    PositionCardComponent
  ],
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
        DashboardAccordionModule,
        DashboardAccordionModule
    ]
})
export class MainModule { }
