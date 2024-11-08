import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PositionAccordionComponent} from './position-accordion.component';
import { PositionCardComponent } from './position-card/position-card.component';
import { CardLineComponent } from './position-card/card-line/card-line.component';
import {MenuModule} from 'primeng/menu';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {EmojiComponent} from '../../../app/emoji/emoji.component';

@NgModule({
  declarations: [PositionAccordionComponent, PositionCardComponent, CardLineComponent],
  imports: [
    CommonModule,
    MenuModule,
    TranslateModule,
    ButtonModule,
    ConfirmDialogModule,
    EmojiComponent,
  ],
  exports: [PositionAccordionComponent],
})
export class PositionAccordionModule { }
