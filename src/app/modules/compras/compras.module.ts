import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasComponent } from './compras.component';
import { ListCompraComponent } from './list-compra/list-compra.component';
import { EditCompraComponent } from './edit-compra/edit-compra.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { ProductoSeleccionadoComponent } from './producto-seleccionado/producto-seleccionado.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';
import { MercaderiaOrderCompraComponent } from './mercaderia-order-compra/mercaderia-order-compra.component';
import { RevisionMercaderiaOrderCompraComponent } from './revision-mercaderia-order-compra/revision-mercaderia-order-compra.component';
import { ModalComprobantesComponent } from './modal-comprobantes/modal-comprobantes.component';
import { ModalMercaderiaIngresadaComponent } from './modal-mercaderia-ingresada/modal-mercaderia-ingresada.component';


@NgModule({
  declarations: [
    ComprasComponent,
    ListCompraComponent,
    EditCompraComponent,
    ProductoSeleccionadoComponent,
    OrdenCompraComponent,
    MercaderiaOrderCompraComponent,
    RevisionMercaderiaOrderCompraComponent,
    ModalComprobantesComponent,
    ModalMercaderiaIngresadaComponent,
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,

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
    FullCalendarModule,
  ]
})
export class ComprasModule { }
