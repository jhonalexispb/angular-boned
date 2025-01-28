import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FabricantesRoutingModule } from './fabricantes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { FabricantesComponent } from './fabricantes.component';
import { ListFabricanteComponent } from './list-fabricante/list-fabricante.component';
import { EditFabricanteComponent } from './edit-fabricante/edit-fabricante.component';
import { CreateFabricanteComponent } from './create-fabricante/create-fabricante.component';


@NgModule({
  declarations: [
    FabricantesComponent,
    ListFabricanteComponent,
    EditFabricanteComponent,
    CreateFabricanteComponent
  ],
  imports: [
    CommonModule,
    FabricantesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule
  ]
})
export class FabricantesModule { }
