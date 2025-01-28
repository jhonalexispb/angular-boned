import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFabricanteComponent } from './list-fabricante/list-fabricante.component';

const routes: Routes = [
  {
    path:'list',
    component: ListFabricanteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FabricantesRoutingModule { }
