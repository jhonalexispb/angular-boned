import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLineasFarmaceuticasComponent } from './list-lineas-farmaceuticas/list-lineas-farmaceuticas.component';

const routes: Routes = [
  {
    path:'list',
    component: ListLineasFarmaceuticasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LineasFarmaceuticasRoutingModule { }
