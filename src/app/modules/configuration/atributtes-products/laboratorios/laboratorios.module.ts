import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaboratoriosRoutingModule } from './laboratorios-routing.module';
import { LaboratoriosComponent } from './laboratorios.component';
import { CreateLaboratoriosComponent } from './create-laboratorios/create-laboratorios.component';
import { EditLaboratoriosComponent } from './edit-laboratorios/edit-laboratorios.component';
import { ListLaboratoriosComponent } from './list-laboratorios/list-laboratorios.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';


@NgModule({
  declarations: [
    LaboratoriosComponent,
    CreateLaboratoriosComponent,
    EditLaboratoriosComponent,
    ListLaboratoriosComponent
  ],
  imports: [
    CommonModule,
    LaboratoriosRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgSelectModule,
    PaginationModule,
    ButtonsGroupListModule
  ]
})
export class LaboratoriosModule { }
