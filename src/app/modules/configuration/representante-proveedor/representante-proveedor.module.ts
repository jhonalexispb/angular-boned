import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepresentanteProveedorRoutingModule } from './representante-proveedor-routing.module';
import { RepresentanteProveedorComponent } from './representante-proveedor.component';
import { ListRepresentanteProveedorComponent } from './list-representante-proveedor/list-representante-proveedor.component';
import { EditRepresentanteProveedorComponent } from './edit-representante-proveedor/edit-representante-proveedor.component';
import { CreateRepresentanteProveedorComponent } from './create-representante-proveedor/create-representante-proveedor.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ComunicationRepresentanteProveedorComponent } from './comunication-representante-proveedor/comunication-representante-proveedor.component';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';

@NgModule({
  declarations: [
    RepresentanteProveedorComponent,
    ListRepresentanteProveedorComponent,
    EditRepresentanteProveedorComponent,
    CreateRepresentanteProveedorComponent,
    ComunicationRepresentanteProveedorComponent
  ],
  imports: [
    CommonModule,
    RepresentanteProveedorRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule
  ],
})
export class RepresentanteProveedorModule { }
