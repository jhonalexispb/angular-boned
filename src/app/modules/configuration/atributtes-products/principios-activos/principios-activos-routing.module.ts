import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPrincipioActivoComponent } from './list-principio-activo/list-principio-activo.component';

const routes: Routes = [
  {
    path:'list',
    component: ListPrincipioActivoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipiosActivosRoutingModule { }
