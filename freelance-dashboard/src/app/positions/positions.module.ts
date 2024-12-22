import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PositionsComponent} from './positions.component';
import {PositionsRoutingModule} from './positions-routing.module';
import {AccordionModule} from '../accordion/accordion.module';
import {StatusBoardComponent} from '../positions-board/status-board.component';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DrawerComponent} from '../drawer/drawer.component';

@NgModule({
  declarations: [
    PositionsComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    PositionsRoutingModule,
    AccordionModule,
    StatusBoardComponent,
    ButtonModule,
    RippleModule,
    DrawerComponent
  ]
})
export class PositionsModule { }
