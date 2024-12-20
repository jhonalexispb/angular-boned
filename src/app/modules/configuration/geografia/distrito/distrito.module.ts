import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistritoRoutingModule } from './distrito-routing.module';
import { DistritoComponent } from './distrito.component';
import { ListDistritoComponent } from './list-distrito/list-distrito.component';
import { CreateDistritoComponent } from './create-distrito/create-distrito.component';
import { EditDistritoComponent } from './edit-distrito/edit-distrito.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    DistritoComponent,
    ListDistritoComponent,
    CreateDistritoComponent,
    EditDistritoComponent
  ],
  imports: [
    CommonModule,
    DistritoRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class DistritoModule { }
