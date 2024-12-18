import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeografiaRoutingModule } from './geografia-routing.module';
import { GeografiaComponent } from './geografia.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    GeografiaComponent
  ],
  imports: [
    CommonModule,
    GeografiaRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class GeografiaModule { }
