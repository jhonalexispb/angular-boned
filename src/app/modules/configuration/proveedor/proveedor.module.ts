import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ListProveedorComponent } from './list-proveedor/list-proveedor.component';
import { EditProveedorComponent } from './edit-proveedor/edit-proveedor.component';
import { CreateProveedorComponent } from './create-proveedor/create-proveedor.component';


@NgModule({
  declarations: [
    ListProveedorComponent,
    EditProveedorComponent,
    CreateProveedorComponent
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule
  ]
})
export class ProveedorModule { }
