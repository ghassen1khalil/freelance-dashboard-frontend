import {RouterModule, Routes} from '@angular/router';
import {PositionsComponent} from './positions.component';
import {StatusBoardComponent} from '../positions-board/status-board.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {path: '', component: PositionsComponent},
  {path: 'positions/:id', component: StatusBoardComponent},
  /*{path: '', redirectTo: '/positions', pathMatch: 'full'},
  {path: '**', redirectTo: '/positions'}*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionsRoutingModule { }
