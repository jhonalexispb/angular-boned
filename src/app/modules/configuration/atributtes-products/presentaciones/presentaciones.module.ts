import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentacionesRoutingModule } from './presentaciones-routing.module';
import { ListPresentacionesComponent } from './list-presentaciones/list-presentaciones.component';
import { EditPresentacionesComponent } from './edit-presentaciones/edit-presentaciones.component';
import { CreatePresentacionesComponent } from './create-presentaciones/create-presentaciones.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    ListPresentacionesComponent,
    EditPresentacionesComponent,
    CreatePresentacionesComponent
  ],
  imports: [
    CommonModule,
    PresentacionesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule,
    ButtonsGroupListModule,
  ]
})
export class PresentacionesModule { }
