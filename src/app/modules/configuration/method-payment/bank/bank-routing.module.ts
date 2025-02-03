import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBankComponent } from './list-bank/list-bank.component';

const routes: Routes = [
  {
    path:'list',
    component: ListBankComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
