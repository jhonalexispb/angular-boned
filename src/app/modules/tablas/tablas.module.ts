import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablasRoutingModule } from './tablas-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'; 
import { TablasComponent } from './tablas.component'; 


@NgModule({
  declarations: [
    TablasComponent
  ],
  imports: [
    CommonModule,
    TablasRoutingModule,
    NgxDatatableModule
  ]
})
export class TablasModule { }
