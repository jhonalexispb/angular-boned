import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { LugarEntregaModule } from './lugar-entrega/lugar-entrega.module';
import { MethodPaymentModule } from './method-payment/method-payment.module';
import { GeografiaModule } from './geografia/geografia.module';
import { AtributtesProductsModule } from './atributtes-products/atributtes-products.module';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SucursalesModule,
    WarehousesModule,
    LugarEntregaModule,
    MethodPaymentModule,
    GeografiaModule,
    AtributtesProductsModule
  ]
})
export class ConfigurationModule { }
