import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { ListVentasComponent } from './list-ventas/list-ventas.component';
import { CreateVentasComponent } from './create-ventas/create-ventas.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ProductoSelectedComponent } from './producto-selected/producto-selected.component';
import { MercaderiaOrdenVentaComponent } from './mercaderia-orden-venta/mercaderia-orden-venta.component';


@NgModule({
  declarations: [
    VentasComponent,
    ListVentasComponent,
    CreateVentasComponent,
    ProductoSelectedComponent,
    MercaderiaOrdenVentaComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,

    HttpClientModule, //peticiones
    FormsModule,
    NgbModule,
    ReactiveFormsModule, //formulario reactivo
    InlineSVGModule,
    NgbModalModule,
    NgSelectModule,
    ButtonsGroupListModule,
    PaginationModule,
    ButtonDropdownOptionModule,
    DropImageModule,
    DivLoadingModule,
  ]
})
export class VentasModule { }
