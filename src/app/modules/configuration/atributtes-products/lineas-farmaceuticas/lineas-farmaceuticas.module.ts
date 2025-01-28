import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineasFarmaceuticasRoutingModule } from './lineas-farmaceuticas-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { LineasFarmaceuticasComponent } from './lineas-farmaceuticas.component';
import { ListLineasFarmaceuticasComponent } from './list-lineas-farmaceuticas/list-lineas-farmaceuticas.component';
import { EditLineasFarmaceuticasComponent } from './edit-lineas-farmaceuticas/edit-lineas-farmaceuticas.component';
import { CreateLineasFarmaceuticasComponent } from './create-lineas-farmaceuticas/create-lineas-farmaceuticas.component';


@NgModule({
  declarations: [
    LineasFarmaceuticasComponent,
    ListLineasFarmaceuticasComponent,
    EditLineasFarmaceuticasComponent,
    CreateLineasFarmaceuticasComponent
  ],
  imports: [
    CommonModule,
    LineasFarmaceuticasRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule
  ]
})
export class LineasFarmaceuticasModule { }
