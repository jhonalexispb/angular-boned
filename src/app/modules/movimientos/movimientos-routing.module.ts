import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimientosComponent } from './movimientos.component';
import { ListMovimientosComponent } from './list-movimientos/list-movimientos.component';
import { CreateMovimientoSalidaComponent } from './create-movimiento-salida/create-movimiento-salida.component';
import { CreateMovimientoIngresoComponent } from './create-movimiento-ingreso/create-movimiento-ingreso.component';

const routes: Routes = [{
    path:'',
    component: MovimientosComponent,
    children:[
      {
        path:'list',
        component: ListMovimientosComponent
      },
      {
        path:'create-salida',
        component: CreateMovimientoSalidaComponent
      },
      {
        path:'create-ingreso',
        component: CreateMovimientoIngresoComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule { }
