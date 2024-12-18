import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentosRoutingModule } from './departamentos-routing.module';
import { DepartamentosComponent } from './departamentos.component';
import { ListDepartamentosComponent } from './list-departamentos/list-departamentos.component';
import { CreateDepartamentosComponent } from './create-departamentos/create-departamentos.component';
import { EditDepartamentosComponent } from './edit-departamentos/edit-departamentos.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    DepartamentosComponent,
    ListDepartamentosComponent,
    CreateDepartamentosComponent,
    EditDepartamentosComponent
  ],
  imports: [
    CommonModule,
    DepartamentosRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class DepartamentosModule { }
