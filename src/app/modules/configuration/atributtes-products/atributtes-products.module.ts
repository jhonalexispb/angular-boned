import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtributtesProductsRoutingModule } from './atributtes-products-routing.module';
import { AtributtesProductsComponent } from './atributtes-products.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PresentacionesComponent } from './presentaciones/presentaciones.component';
import { CondicionesAlmacenamientoComponent } from './condiciones-almacenamiento/condiciones-almacenamiento.component';


@NgModule({
  declarations: [
    AtributtesProductsComponent,
    PresentacionesComponent,
    CondicionesAlmacenamientoComponent
  ],
  imports: [
    CommonModule,
    AtributtesProductsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class AtributtesProductsModule { }
