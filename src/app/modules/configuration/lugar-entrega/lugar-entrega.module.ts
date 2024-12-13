import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LugarEntregaRoutingModule } from './lugar-entrega-routing.module';
import { CreateLugarEntregaComponent } from './create-lugar-entrega/create-lugar-entrega.component';
import { EditLugarEntregaComponent } from './edit-lugar-entrega/edit-lugar-entrega.component';
import { ListLugarEntregaComponent } from './list-lugar-entrega/list-lugar-entrega.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LugarEntregaComponent } from './lugar-entrega.component';


@NgModule({
  declarations: [
    LugarEntregaComponent,
    CreateLugarEntregaComponent,
    EditLugarEntregaComponent,
    ListLugarEntregaComponent,
    LoadingScreenComponent
  ],
  imports: [
    CommonModule,
    LugarEntregaRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class LugarEntregaModule { }