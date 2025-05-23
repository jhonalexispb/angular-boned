import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransporteOrdenVentaComponent } from './transporte-orden-venta.component';
import { ListTransporteOrdenVentaComponent } from './list-transporte-orden-venta/list-transporte-orden-venta.component';

const routes: Routes = [
  {
        path:'',
        component: TransporteOrdenVentaComponent,
        children:[
          {
            path:'list',
            component: ListTransporteOrdenVentaComponent
          },
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransporteOrdenVentaRoutingModule { }
