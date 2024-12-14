import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodPaymentComponent } from './method-payment.component';
import { MethodComponent } from './method/method.component';

const routes: Routes = [
  {
    path: '',
    component: MethodPaymentComponent,
    children: [
      {
        path: 'metodo',
        component: MethodComponent,
        loadChildren: () => import('./method/method.module').then(m => m.MethodModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodPaymentRoutingModule { }
