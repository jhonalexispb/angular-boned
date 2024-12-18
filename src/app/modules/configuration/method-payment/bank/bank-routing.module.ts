import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBankComponent } from './list-bank/list-bank.component';
import { AsignarComprobanteComponent } from './asignar-comprobante/asignar-comprobante.component';

const routes: Routes = [
  {
    path:'list',
    component: ListBankComponent
  },
  {
    path:'asignar-comprobante',
    component: AsignarComprobanteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
