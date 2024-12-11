import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses.component';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { EditWarehouseComponent } from './edit-warehouse/edit-warehouse.component';
import { DeleteWarehouseComponent } from './delete-warehouse/delete-warehouse.component';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';


@NgModule({
  declarations: [
    WarehousesComponent,
    CreateWarehouseComponent,
    EditWarehouseComponent,
    DeleteWarehouseComponent,
    ListWarehouseComponent,
    LoadingScreenComponent
  ],
  imports: [
    CommonModule,
    WarehousesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
  ]
})
export class WarehousesModule { }
