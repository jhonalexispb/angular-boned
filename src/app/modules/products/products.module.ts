import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { ModalCodigosDigemidComponent } from './modal-codigos-digemid/modal-codigos-digemid.component';
import { ModalGestionarComponent } from './modal-gestionar/modal-gestionar.component';
import { ModalLotesComponent } from './modal-lotes/modal-lotes.component';
import { ModalEscalasComponent } from './modal-escalas/modal-escalas.component';
import { CreateEscalasComponent } from './create-escalas/create-escalas.component';
import { EditEscalasComponent } from './edit-escalas/edit-escalas.component';


@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ListProductComponent,
    ModalCodigosDigemidComponent,
    ModalGestionarComponent,
    ModalLotesComponent,
    ModalEscalasComponent,
    CreateEscalasComponent,
    EditEscalasComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,

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
    DropImageModule
  ]
})
export class ProductsModule { }
