import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvinciaComponent } from './provincia.component';
import { ListProvinciaComponent } from './list-provincia/list-provincia.component';

const routes: Routes = [
  {
    path:'',
    component: ProvinciaComponent,
    children: [
      {
        path:'list',
        component: ListProvinciaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinciaRoutingModule { }
