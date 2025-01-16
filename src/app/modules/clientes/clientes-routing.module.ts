import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { RucComponent } from './ruc/ruc.component';
import { SucursalesComponent } from './sucursales/sucursales.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesComponent,
    children: [
      {
        path: 'ruc',
        component: RucComponent,
        loadChildren: () => import('./ruc/ruc.module').then(m => m.RucModule)
      },
      {
        path: 'sucursales',
        component: SucursalesComponent,
        loadChildren: () => import('./sucursales/sucursales.module').then(m => m.SucursalesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
