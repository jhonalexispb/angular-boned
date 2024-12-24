import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepresentanteProveedorComponent } from './representante-proveedor.component';
import { ListRepresentanteProveedorComponent } from './list-representante-proveedor/list-representante-proveedor.component';

const routes: Routes = [
  {
    path: '',
    component: RepresentanteProveedorComponent,
    children:[
      {
        path:'list',
        component:ListRepresentanteProveedorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepresentanteProveedorRoutingModule { }
