import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaboratoriosRoutingModule } from './laboratorios-routing.module';
import { LaboratoriosComponent } from './laboratorios.component';
import { CreateLaboratoriosComponent } from './create-laboratorios/create-laboratorios.component';
import { EditLaboratoriosComponent } from './edit-laboratorios/edit-laboratorios.component';
import { ListLaboratoriosComponent } from './list-laboratorios/list-laboratorios.component';


@NgModule({
  declarations: [
    LaboratoriosComponent,
    CreateLaboratoriosComponent,
    EditLaboratoriosComponent,
    ListLaboratoriosComponent
  ],
  imports: [
    CommonModule,
    LaboratoriosRoutingModule
  ]
})
export class LaboratoriosModule { }
