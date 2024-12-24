import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoCategoriaComponent } from './producto-categoria.component';
import { ListCategoriaComponent } from './list-categoria/list-categoria.component';

const routes: Routes = [
  {
    path:'',
    component:ProductoCategoriaComponent,
    children:
    [
      {
        path:'list',
        component:ListCategoriaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoCategoriaRoutingModule { }
