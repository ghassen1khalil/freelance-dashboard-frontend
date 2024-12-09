import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionComponent} from './accordion.component';
import {MenuModule} from 'primeng/menu';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {EmojiComponent} from '../emoji/emoji.component';
import { PositionCardComponent } from '../position-card/position-card.component';
import {StatusBoardComponent} from '../positions-board/status-board.component';
import {DragDropModule} from 'primeng/dragdrop';

@NgModule({
  declarations: [AccordionComponent],
  imports: [
    CommonModule,
    MenuModule,
    TranslateModule,
    ButtonModule,
    ConfirmDialogModule,
    EmojiComponent,
    StatusBoardComponent,
    DragDropModule
  ],
  exports: [AccordionComponent],
})
export class AccordionModule { }
