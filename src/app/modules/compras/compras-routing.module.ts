import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras.component';
import { ListCompraComponent } from './list-compra/list-compra.component';

const routes: Routes = [
  {
    path:'',
    component: ComprasComponent,
    children:[
      {
        path:"list",
        component: ListCompraComponent
      },
      {
        path: 'register',
        loadChildren: () => import('./orden-compra/orden-compra.module').then((m) => m.OrdenCompraModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./edit-compra/edit-compra.module').then((m) => m.EditCompraModule),
      },
      {
        path: 'check-mercaderia',
        loadChildren: () => import('./revision-mercaderia-order-compra/revision-mercaderia-order-compra.module').then((m) => m.RevisionMercaderiaOrderCompraModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
