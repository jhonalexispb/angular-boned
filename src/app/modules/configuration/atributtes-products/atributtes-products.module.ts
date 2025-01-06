import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtributtesProductsRoutingModule } from './atributtes-products-routing.module';
import { AtributtesProductsComponent } from './atributtes-products.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    AtributtesProductsComponent
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
