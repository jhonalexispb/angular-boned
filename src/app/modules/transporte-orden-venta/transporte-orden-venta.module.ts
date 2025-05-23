import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransporteOrdenVentaRoutingModule } from './transporte-orden-venta-routing.module';
import { ListTransporteOrdenVentaComponent } from './list-transporte-orden-venta/list-transporte-orden-venta.component';
import { CreateTransporteOrdenVentaComponent } from './create-transporte-orden-venta/create-transporte-orden-venta.component';
import { EditTransporteOrdenVentaComponent } from './edit-transporte-orden-venta/edit-transporte-orden-venta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { TransporteOrdenVentaComponent } from './transporte-orden-venta.component';


@NgModule({
  declarations: [
    TransporteOrdenVentaComponent,
    ListTransporteOrdenVentaComponent,
    CreateTransporteOrdenVentaComponent,
    EditTransporteOrdenVentaComponent,
  ],
  imports: [
    CommonModule,
    TransporteOrdenVentaRoutingModule,

    HttpClientModule, //peticiones
    FormsModule,
    NgbModule,
    ReactiveFormsModule, //formulario reactivo
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    DataTablesModule,
    NgSelectModule,
    ButtonsGroupListModule,
    PaginationModule,
    ButtonDropdownOptionModule,
    DropImageModule,
    DivLoadingModule
  ]
})
export class TransporteOrdenVentaModule { }
