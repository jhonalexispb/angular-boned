import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { LugarEntregaModule } from './lugar-entrega/lugar-entrega.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SucursalesModule,
    WarehousesModule,
    LugarEntregaModule,
  ]
})
export class ConfigurationModule { }
