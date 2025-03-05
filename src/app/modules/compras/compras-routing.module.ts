import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras.component';
import { ListCompraComponent } from './list-compra/list-compra.component';
import { CreateCompraComponent } from './create-compra/create-compra.component';
import { CronogramaComponent } from './cronograma/cronograma.component';
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
        path:"register",
        component: OrdenCompraComponent
      },
      {
        path:"create",
        component: CreateCompraComponent
      },
      {
        path:"cronograma",
        component: CronogramaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
