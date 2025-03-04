import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaVentaRoutingModule } from './zona-venta-routing.module';
import { ListZonaVentaComponent } from './list-zona-venta/list-zona-venta.component';
import { GestionarZonaVentaComponent } from './gestionar-zona-venta/gestionar-zona-venta.component';
import { GestionarZonaVentaDepartamentoComponent } from './gestionar-zona-venta-departamento/gestionar-zona-venta-departamento.component';
import { ZonaVentaComponent } from './zona-venta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { ComunicationPersonEmailModule } from 'src/app/components/comunication-person-email/comunication-person-email.module';
import { ComunicationPersonModule } from 'src/app/components/comunication-person/comunication-person.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    ListZonaVentaComponent,
    GestionarZonaVentaComponent,
    GestionarZonaVentaDepartamentoComponent,
    ZonaVentaComponent
  ],
  imports: [
    CommonModule,
    ZonaVentaRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule,
    ButtonsGroupListModule,
    NgSelectModule,
    ComunicationPersonModule,
    ComunicationPersonEmailModule
  ]
})
export class ZonaVentaModule { }
