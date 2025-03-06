import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras.component';
import { ListCompraComponent } from './list-compra/list-compra.component';
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
