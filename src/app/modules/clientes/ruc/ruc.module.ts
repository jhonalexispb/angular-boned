import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RucRoutingModule } from './ruc-routing.module';
import { RucComponent } from './ruc.component';
import { ListRucComponent } from './list-ruc/list-ruc.component';
import { EditRucComponent } from './edit-ruc/edit-ruc.component';
import { CreateRucComponent } from './create-ruc/create-ruc.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';




@NgModule({
  declarations: [
    RucComponent,
    ListRucComponent,
    EditRucComponent,
    CreateRucComponent,
  ],
  imports: [
    CommonModule,
    RucRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule  
  ]
})
export class RucModule { }
