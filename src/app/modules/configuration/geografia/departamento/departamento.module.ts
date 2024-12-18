import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { DepartamentoComponent } from './departamento.component';
import { CreateDepartamentoComponent } from './create-departamento/create-departamento.component';
import { ListDepartamentoComponent } from './list-departamento/list-departamento.component';
import { EditDepartamentoComponent } from './edit-departamento/edit-departamento.component';


@NgModule({
  declarations: [
    DepartamentoComponent,
    CreateDepartamentoComponent,
    ListDepartamentoComponent,
    EditDepartamentoComponent
  ],
  imports: [
    CommonModule,
    DepartamentoRoutingModule
  ]
})
export class DepartamentoModule { }
