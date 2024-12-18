import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinciaRoutingModule } from './provincia-routing.module';
import { ProvinciaComponent } from './provincia.component';
import { EditProvinciaComponent } from './edit-provincia/edit-provincia.component';
import { ListProvinciaComponent } from './list-provincia/list-provincia.component';
import { CreateProvinciaComponent } from './create-provincia/create-provincia.component';


@NgModule({
  declarations: [
    ProvinciaComponent,
    EditProvinciaComponent,
    ListProvinciaComponent,
    CreateProvinciaComponent
  ],
  imports: [
    CommonModule,
    ProvinciaRoutingModule
  ]
})
export class ProvinciaModule { }
