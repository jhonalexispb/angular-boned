import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ListProveedorComponent } from './list-proveedor/list-proveedor.component';
import { EditProveedorComponent } from './edit-proveedor/edit-proveedor.component';
import { CreateProveedorComponent } from './create-proveedor/create-proveedor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ProveedorComponent } from './proveedor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { ComunicationProveedorComponent } from './comunication-proveedor/comunication-proveedor.component';
import { GestionarLaboratorioComponent } from './gestionar-laboratorio/gestionar-laboratorio.component';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { EditProveedorLaboratorioComponent } from './edit-proveedor-laboratorio/edit-proveedor-laboratorio.component';
import { CreateProveedorLaboratorioComponent } from './create-proveedor-laboratorio/create-proveedor-laboratorio.component';


@NgModule({
  declarations: [
    ListProveedorComponent,
    EditProveedorComponent,
    CreateProveedorComponent,
    ProveedorComponent,
    ComunicationProveedorComponent,
    GestionarLaboratorioComponent,
    EditProveedorLaboratorioComponent,
    CreateProveedorLaboratorioComponent,
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgSelectModule,
    PaginationModule,
    ButtonsGroupListModule,
    DivLoadingModule
  ]
})
export class ProveedorModule { }
