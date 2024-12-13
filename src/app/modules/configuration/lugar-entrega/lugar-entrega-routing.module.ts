import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LugarEntregaComponent } from './lugar-entrega.component';
import { ListLugarEntregaComponent } from './list-lugar-entrega/list-lugar-entrega.component';

const routes: Routes = [
  {
    path: '',
    component: LugarEntregaComponent,
    children: [
      {
        path: 'list',
        component: ListLugarEntregaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LugarEntregaRoutingModule { }
