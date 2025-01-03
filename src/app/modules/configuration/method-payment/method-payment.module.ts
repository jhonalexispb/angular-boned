import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MethodPaymentRoutingModule } from './method-payment-routing.module';
import { MethodPaymentComponent } from './method-payment.component';
import { MethodModule } from './method/method.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    MethodPaymentComponent
  ],
  imports: [
    CommonModule,
    MethodPaymentRoutingModule,
    MethodModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class MethodPaymentModule { }
