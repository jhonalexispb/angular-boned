import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { CreateDepartamentoComponent } from './create-departamento/create-departamento.component';
import { ListDepartamentoComponent } from './list-departamento/list-departamento.component';
import { EditDepartamentoComponent } from './edit-departamento/edit-departamento.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    DepartamentoComponent,
    CreateDepartamentoComponent,
    ListDepartamentoComponent,
    EditDepartamentoComponent
  ],
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule
  ]
})
export class DepartamentoModule { }
