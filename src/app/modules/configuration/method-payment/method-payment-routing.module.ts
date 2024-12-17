import { BankComponent } from './bank/bank.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodPaymentComponent } from './method-payment.component';
import { MethodComponent } from './method/method.component';
import { ComprobanteComponent } from './comprobante/comprobante.component';

const routes: Routes = [
  {
    path: '',
    component: MethodPaymentComponent,
    children: [
      {
        path: 'metodo',
        component: MethodComponent,
        loadChildren: () => import('./method/method.module').then(m => m.MethodModule)
      },
      {
        path: 'banco',
        component: BankComponent,
        loadChildren: () => import('./bank/bank.module').then(m => m.BankModule)
      },
      {
        path: 'comprobante-pago',
        component: ComprobanteComponent,
        loadChildren: () => import('./comprobante/comprobante.module').then(m => m.ComprobanteModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodPaymentRoutingModule { }
