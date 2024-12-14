import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { BankComponent } from './bank.component';
import { ListBankComponent } from './list-bank/list-bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { CreateBankComponent } from './create-bank/create-bank.component';


@NgModule({
  declarations: [
    BankComponent,
    ListBankComponent,
    EditBankComponent,
    CreateBankComponent,
  ],
  imports: [
    CommonModule,
    BankRoutingModule
  ]
})
export class BankModule { }
