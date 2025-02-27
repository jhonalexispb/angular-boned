import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { ListVentasComponent } from './list-ventas/list-ventas.component';
import { CreateVentasComponent } from './create-ventas/create-ventas.component';

const routes: Routes = [
  {
    path:'',
    component: VentasComponent,
    children:[
      {
        path:"list",
        component: ListVentasComponent
      },
      {
        path:"register",
        component: CreateVentasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
