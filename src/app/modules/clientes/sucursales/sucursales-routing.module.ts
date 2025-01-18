import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSucursalesComponent } from './list-sucursales/list-sucursales.component';

const routes: Routes = [
  {
    path:'list',
    component:ListSucursalesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalesRoutingModule { }
