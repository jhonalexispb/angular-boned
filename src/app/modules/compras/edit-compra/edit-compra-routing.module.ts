import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCompraComponent } from './edit-compra.component';
import { EditOrderCompraComponent } from './edit-order-compra/edit-order-compra.component';
import { EditCronogramaOrderCompraComponent } from './edit-cronograma-order-compra/edit-cronograma-order-compra.component';

const routes: Routes = [
  {
    path: '',
    component: EditCompraComponent,
    children: [
      {
        path: 'edit_order_compra_cronograma',
        component: EditCronogramaOrderCompraComponent,
        /* loadChildren: () => import('./method/method.module').then(m => m.MethodModule) */
      },
      {
        path: 'edit_compra/:id',
        component: EditOrderCompraComponent,
        /* loadChildren: () => import('./bank/bank.module').then(m => m.BankModule) */
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCompraRoutingModule { }
