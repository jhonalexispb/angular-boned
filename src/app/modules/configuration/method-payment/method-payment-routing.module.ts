import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MethodPaymentComponent } from './method-payment.component';
import { MethodComponent } from './method/method.component';
import { ListMethodComponent } from './method/list-method/list-method.component';

const routes: Routes = [
  {
    path: '',
    component: MethodPaymentComponent,
    children: [
      {
        path: 'metodo',
        component: MethodComponent,
        children: [
          {
            path: 'list', // Ruta para el componente `ListMethodComponent`
            component: ListMethodComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodPaymentRoutingModule { }
