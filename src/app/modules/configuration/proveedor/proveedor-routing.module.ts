import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProveedorComponent } from './list-proveedor/list-proveedor.component';
import { ProveedorComponent } from './proveedor.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedorComponent,
    children:[
      {
        path:'list',
        component:ListProveedorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
