import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRucComponent } from './list-ruc/list-ruc.component';

const routes: Routes = [
  {
    path:'list',
    component:ListRucComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RucRoutingModule { }
