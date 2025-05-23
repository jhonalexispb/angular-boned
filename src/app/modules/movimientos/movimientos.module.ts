import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovimientosRoutingModule } from './movimientos-routing.module';
import { ListMovimientosComponent } from './list-movimientos/list-movimientos.component';
import { CreateMovimientoSalidaComponent } from './create-movimiento-salida/create-movimiento-salida.component';
import { CreateMovimientoIngresoComponent } from './create-movimiento-ingreso/create-movimiento-ingreso.component';
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
import { MovimientosComponent } from './movimientos.component';


@NgModule({
  declarations: [
    ListMovimientosComponent,
    CreateMovimientoSalidaComponent,
    CreateMovimientoIngresoComponent,
    MovimientosComponent
  ],
  imports: [
    CommonModule,
    MovimientosRoutingModule,

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
export class MovimientosModule { }
