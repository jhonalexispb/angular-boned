import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipiosActivosRoutingModule } from './principios-activos-routing.module';
import { PrincipiosActivosComponent } from './principios-activos.component';
import { CreatePrincipioActivoComponent } from './create-principio-activo/create-principio-activo.component';
import { EditPrincipioActivoComponent } from './edit-principio-activo/edit-principio-activo.component';
import { ListPrincipioActivoComponent } from './list-principio-activo/list-principio-activo.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    PrincipiosActivosComponent,
    CreatePrincipioActivoComponent,
    EditPrincipioActivoComponent,
    ListPrincipioActivoComponent
  ],
  imports: [
    CommonModule,
    PrincipiosActivosRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgSelectModule,
    PaginationModule 
  ]
})
export class PrincipiosActivosModule { }
