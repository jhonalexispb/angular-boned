import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListZonaVentaComponent } from './list-zona-venta/list-zona-venta.component';

const routes: Routes = [
  {
    path:'list',
    component:ListZonaVentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaVentaRoutingModule { }
