import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprobanteRoutingModule } from './comprobante-routing.module';
import { ComprobanteComponent } from './comprobante.component';
import { CreateComprobanteComponent } from './create-comprobante/create-comprobante.component';
import { ListComprobanteComponent } from './list-comprobante/list-comprobante.component';
import { EditComprobanteComponent } from './edit-comprobante/edit-comprobante.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    ComprobanteComponent,
    CreateComprobanteComponent,
    ListComprobanteComponent,
    EditComprobanteComponent
  ],
  imports: [
    CommonModule,
    ComprobanteRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule
  ]
})
export class ComprobanteModule { }
