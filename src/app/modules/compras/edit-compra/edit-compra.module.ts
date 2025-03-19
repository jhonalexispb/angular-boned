import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCompraRoutingModule } from './edit-compra-routing.module';
import { EditOrderCompraComponent } from './edit-order-compra/edit-order-compra.component';
import { EditCronogramaOrderCompraComponent } from './edit-cronograma-order-compra/edit-cronograma-order-compra.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    EditOrderCompraComponent,
    EditCronogramaOrderCompraComponent
  ],
  imports: [
    CommonModule,
    EditCompraRoutingModule,

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
export class EditCompraModule { }
