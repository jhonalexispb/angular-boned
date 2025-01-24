import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalesRoutingModule } from './sucursales-routing.module';
import { SucursalesComponent } from './sucursales.component';
import { ListSucursalesComponent } from './list-sucursales/list-sucursales.component';
import { EditSucursalesComponent } from './edit-sucursales/edit-sucursales.component';
import { CreateSucursalesComponent } from './create-sucursales/create-sucursales.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComunicationPersonModule } from 'src/app/components/comunication-person/comunication-person.module';


@NgModule({
  declarations: [
    SucursalesComponent,
    ListSucursalesComponent,
    EditSucursalesComponent,
    CreateSucursalesComponent
  ],
  imports: [
    CommonModule,
    SucursalesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule,
    ButtonsGroupListModule,
    NgSelectModule,
    ComunicationPersonModule
  ]
})
export class SucursalesModule { }
