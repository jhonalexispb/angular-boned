import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { CreateRolesComponent } from './create-roles/create-roles.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    RolesComponent,
    CreateRolesComponent,
    EditRolesComponent,
    ListRolesComponent,
    LoadingScreenComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,

    HttpClientModule, //peticiones
    FormsModule,
    NgbModule,
    ReactiveFormsModule, //formulario reactivo
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    DataTablesModule,
  ]
})
export class RolesModule { }
