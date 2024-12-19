import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartamentoComponent } from './departamento.component';
import { ListDepartamentoComponent } from './list-departamento/list-departamento.component';

const routes: Routes = [
  {
    path:'',
    component: DepartamentoComponent,
    children: [
      {
        path:'list',
        component: ListDepartamentoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { }
