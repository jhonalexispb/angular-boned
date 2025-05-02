import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuiasPrestamoRoutingModule } from './guias-prestamo-routing.module';
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
import { ListGuiaPrestamoComponent } from './list-guia-prestamo/list-guia-prestamo.component';
import { CreateGuiaPrestamoComponent } from './create-guia-prestamo/create-guia-prestamo.component';
import { ProductoSeleccionadoGuiaPrestamoComponent } from './producto-seleccionado-guia-prestamo/producto-seleccionado-guia-prestamo.component';


@NgModule({
  declarations: [
    ListGuiaPrestamoComponent,
    CreateGuiaPrestamoComponent,
    ProductoSeleccionadoGuiaPrestamoComponent
  ],
  imports: [
    CommonModule,
    GuiasPrestamoRoutingModule,
    
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
export class GuiasPrestamoModule { }
