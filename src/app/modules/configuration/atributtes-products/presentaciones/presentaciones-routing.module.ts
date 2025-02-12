import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPresentacionesComponent } from './list-presentaciones/list-presentaciones.component';

const routes: Routes = [
  {
    path:'list',
    component: ListPresentacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentacionesRoutingModule { }
