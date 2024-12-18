import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistritoRoutingModule } from './distrito-routing.module';
import { DistritoComponent } from './distrito.component';
import { ListDistritoComponent } from './list-distrito/list-distrito.component';
import { CreateDistritoComponent } from './create-distrito/create-distrito.component';
import { EditDistritoComponent } from './edit-distrito/edit-distrito.component';


@NgModule({
  declarations: [
    DistritoComponent,
    ListDistritoComponent,
    CreateDistritoComponent,
    EditDistritoComponent
  ],
  imports: [
    CommonModule,
    DistritoRoutingModule
  ]
})
export class DistritoModule { }
