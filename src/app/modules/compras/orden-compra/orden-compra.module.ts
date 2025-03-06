import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenCompraRoutingModule } from './orden-compra-routing.module';
import { CronogramaComponent } from './cronograma/cronograma.component';
import { CreateCompraComponent } from './create-compra/create-compra.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { CreateEventoComponent } from './cronograma/create-evento/create-evento.component';
import { CuotasComponent } from './cronograma/cuotas/cuotas.component';
import { EditEventoComponent } from './cronograma/edit-evento/edit-evento.component';


@NgModule({
  declarations: [
    CronogramaComponent,
    CreateCompraComponent,
    CreateEventoComponent,
    CuotasComponent,
    EditEventoComponent
  ],
  imports: [
    CommonModule,
    OrdenCompraRoutingModule,

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
export class OrdenCompraModule { }
