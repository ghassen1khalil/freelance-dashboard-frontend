import {NgModule} from '@angular/core';
import {HeaderComponent} from './header.component';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {BadgeModule} from 'primeng/badge';
import {MenuModule} from 'primeng/menu';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent],
    imports: [CommonModule, ButtonModule, TranslateModule, AvatarModule, BadgeModule, MenuModule, InputTextModule, DropdownModule, FormsModule, ReactiveFormsModule],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
