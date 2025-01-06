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
  {
    path: 'atributos-producto',
    loadChildren: () => import('./atributtes-products/atributtes-products.module').then((m) => m.AtributtesProductsModule),
  },
  {
    path: 'representante-proveedor',
    loadChildren: () => import('./representante-proveedor/representante-proveedor.module').then((m) => m.RepresentanteProveedorModule),
  },
  {
    path: 'proveedor',
    loadChildren: () => import('./proveedor/proveedor.module').then((m) => m.ProveedorModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
