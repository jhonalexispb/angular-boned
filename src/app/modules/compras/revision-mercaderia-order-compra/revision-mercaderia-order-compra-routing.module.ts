import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisionMercaderiaOrderCompraComponent } from './revision-mercaderia-order-compra.component';
import { CheckMercaderiaComponent } from './check-mercaderia/check-mercaderia.component';
import { FacturasGeneradasComponent } from './facturas-generadas/facturas-generadas.component';

const routes: Routes = [
  {
      path: '',
      component: RevisionMercaderiaOrderCompraComponent,
      children: [
        {
          path: 'ckeck/:id',
          component: CheckMercaderiaComponent,
          /* loadChildren: () => import('./method/method.module').then(m => m.MethodModule) */
        },
        {
          path: 'facturas-generadas',
          component: FacturasGeneradasComponent,
          /* loadChildren: () => import('./bank/bank.module').then(m => m.BankModule) */
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisionMercaderiaOrderCompraRoutingModule { }
