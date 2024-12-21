import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinciaRoutingModule } from './provincia-routing.module';
import { ProvinciaComponent } from './provincia.component';
import { EditProvinciaComponent } from './edit-provincia/edit-provincia.component';
import { ListProvinciaComponent } from './list-provincia/list-provincia.component';
import { CreateProvinciaComponent } from './create-provincia/create-provincia.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ProvinciaComponent,
    EditProvinciaComponent,
    ListProvinciaComponent,
    CreateProvinciaComponent
  ],
  imports: [
    CommonModule,
    ProvinciaRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgSelectModule
  ]
})
export class ProvinciaModule { }
