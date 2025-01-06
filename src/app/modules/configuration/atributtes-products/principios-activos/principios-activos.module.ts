import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipiosActivosRoutingModule } from './principios-activos-routing.module';
import { PrincipiosActivosComponent } from './principios-activos.component';
import { CreatePrincipioActivoComponent } from './create-principio-activo/create-principio-activo.component';
import { EditPrincipioActivoComponent } from './edit-principio-activo/edit-principio-activo.component';
import { ListPrincipioActivoComponent } from './list-principio-activo/list-principio-activo.component';


@NgModule({
  declarations: [
    PrincipiosActivosComponent,
    CreatePrincipioActivoComponent,
    EditPrincipioActivoComponent,
    ListPrincipioActivoComponent
  ],
  imports: [
    CommonModule,
    PrincipiosActivosRoutingModule
  ]
})
export class PrincipiosActivosModule { }
