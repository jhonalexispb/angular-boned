import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sucursales',
    loadChildren: () => import('./sucursales/sucursales.module').then((m) => m.SucursalesModule),
  },

  {
    path: 'almacenes',
    loadChildren: () => import('./warehouses/warehouses.module').then((m) => m.WarehousesModule),
  },

  {
    path: 'lugar-de-entrega',
    loadChildren: () => import('./lugar-entrega/lugar-entrega.module').then((m) => m.LugarEntregaModule),
  },

  {
    path: 'metodo-pago',
    loadChildren: () => import('./method-payment/method-payment.module').then((m) => m.MethodPaymentModule),
  },
  {
    path: 'geografia',
    loadChildren: () => import('./geografia/geografia.module').then((m) => m.GeografiaModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
