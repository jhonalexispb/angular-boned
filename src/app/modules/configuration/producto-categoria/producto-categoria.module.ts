import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoCategoriaRoutingModule } from './producto-categoria-routing.module';
import { ProductoCategoriaComponent } from './producto-categoria.component';
import { ListCategoriaComponent } from './list-categoria/list-categoria.component';
import { CreateCategoriaComponent } from './create-categoria/create-categoria.component';
import { EditCategoriaComponent } from './edit-categoria/edit-categoria.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ProductoCategoriaComponent,
    ListCategoriaComponent,
    CreateCategoriaComponent,
    EditCategoriaComponent
  ],
  imports: [
    CommonModule,
    ProductoCategoriaRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class ProductoCategoriaModule { }
