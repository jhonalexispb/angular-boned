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
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { ComprobantesComponent } from './comprobantes/comprobantes.component';
import { CreateRelacionBancoComprobanteComponent } from './create-relacion-banco-comprobante/create-relacion-banco-comprobante.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditRelacionBancoComprobanteComponent } from './edit-relacion-banco-comprobante/edit-relacion-banco-comprobante.component';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';


@NgModule({
  declarations: [
    BankComponent,
    ListBankComponent,
    EditBankComponent,
    CreateBankComponent,
    ComprobantesComponent,
    CreateRelacionBancoComprobanteComponent,
    EditRelacionBancoComprobanteComponent,
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
    PaginationModule,
    ButtonsGroupListModule,
    DropzoneModule,
    NgSelectModule,
    DropImageModule
  ]
})
export class BankModule { }
