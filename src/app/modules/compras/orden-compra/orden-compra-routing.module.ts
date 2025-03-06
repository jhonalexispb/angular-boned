import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenCompraComponent } from './orden-compra.component';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { CreateCompraComponent } from './create-compra/create-compra.component';

const routes: Routes = [
  {
      path: '',
      component: OrdenCompraComponent,
      children: [
        {
          path: 'cronograma',
          component: CronogramaComponent,
          /* loadChildren: () => import('./method/method.module').then(m => m.MethodModule) */
        },
        {
          path: 'create_compra',
          component: CreateCompraComponent,
          /* loadChildren: () => import('./bank/bank.module').then(m => m.BankModule) */
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenCompraRoutingModule { }
