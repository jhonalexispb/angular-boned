import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSucursalComponent } from '../../configuration/sucursales/list-sucursal/list-sucursal.component';

const routes: Routes = [
  {
    path:'list',
    component:ListSucursalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalesRoutingModule { }
