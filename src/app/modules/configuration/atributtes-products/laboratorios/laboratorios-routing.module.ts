import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLaboratoriosComponent } from './list-laboratorios/list-laboratorios.component';

const routes: Routes = [
  {
    path:'list',
    component: ListLaboratoriosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaboratoriosRoutingModule { }
