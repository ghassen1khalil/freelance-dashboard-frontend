import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {FieldsetModule} from 'primeng/fieldset';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  exports: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FieldsetModule,
    TranslateModule
  ]
})
export class ProfileModule {
}
