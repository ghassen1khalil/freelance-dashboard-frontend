import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccordionComponent} from './accordion.component';
import { PositionCardComponent } from './position-card/position-card.component';
import { CardLineComponent } from './position-card/card-line/card-line.component';
import {AngularEmojisModule} from 'angular-emojis';
import {MenuModule} from 'primeng/menu';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';






@NgModule({
  declarations: [AccordionComponent, PositionCardComponent, CardLineComponent],
  imports: [
    CommonModule,
    AngularEmojisModule,
    MenuModule,
    TranslateModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  exports: [AccordionComponent],
})
export class AccordionModule { }
