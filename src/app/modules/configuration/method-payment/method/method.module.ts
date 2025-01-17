import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MethodRoutingModule } from './method-routing.module';
import { MethodComponent } from './method.component';
import { ListMethodComponent } from './list-method/list-method.component';
import { EditMethodComponent } from './edit-method/edit-method.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    MethodComponent,
    ListMethodComponent,
    EditMethodComponent
  ],
  imports: [
    CommonModule,
    MethodRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule
  ]
})
export class MethodModule { }
