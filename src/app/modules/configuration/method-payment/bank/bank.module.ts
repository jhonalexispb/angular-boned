import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { BankComponent } from './bank.component';
import { ListBankComponent } from './list-bank/list-bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import { CreateBankComponent } from './create-bank/create-bank.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AsignarComprobanteComponent } from './asignar-comprobante/asignar-comprobante.component';


@NgModule({
  declarations: [
    BankComponent,
    ListBankComponent,
    EditBankComponent,
    CreateBankComponent,
    AsignarComprobanteComponent,
  ],
  imports: [
    CommonModule,
    BankRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class BankModule { }
