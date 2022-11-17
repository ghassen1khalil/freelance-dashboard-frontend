import {RouterModule, Routes} from '@angular/router';
import {AddPositionComponent} from './add-position.component';
import {NgModule} from '@angular/core';

const routes: Routes = [

  {
    path: '',
    component: AddPositionComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPositionRoutingModule { }
