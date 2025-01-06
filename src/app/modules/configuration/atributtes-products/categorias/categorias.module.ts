import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasComponent } from './categorias.component';
import { ListCategoriasComponent } from './list-categorias/list-categorias.component';
import { EditCategoriasComponent } from './edit-categorias/edit-categorias.component';
import { CreateCategoriasComponent } from './create-categorias/create-categorias.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    CategoriasComponent,
    ListCategoriasComponent,
    EditCategoriasComponent,
    CreateCategoriasComponent
  ],
  imports: [
    CommonModule,
    CategoriasRoutingModule,
    

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class CategoriasModule { }
