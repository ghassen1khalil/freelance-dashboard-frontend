import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {FieldsetModule} from 'primeng/fieldset';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DividerModule} from 'primeng/divider';
import {PasswordModule} from 'primeng/password';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FloatLabelModule} from 'primeng/floatlabel';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  exports: [ProfileComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        FieldsetModule,
        TranslateModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        RippleModule,
        DividerModule,
        PasswordModule,
      FloatLabelModule,
        ConfirmDialogModule
    ]
})
export class ProfileModule {
}
