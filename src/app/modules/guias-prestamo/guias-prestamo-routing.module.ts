import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuiasPrestamoComponent } from './guias-prestamo.component';
import { ListGuiaPrestamoComponent } from './list-guia-prestamo/list-guia-prestamo.component';
import { CreateGuiaPrestamoComponent } from './create-guia-prestamo/create-guia-prestamo.component';

const routes: Routes = [
  {
      path:'',
      component: GuiasPrestamoComponent,
      children:[
        {
          path:'list',
          component: ListGuiaPrestamoComponent
        },
        {
          path:'create',
          component: CreateGuiaPrestamoComponent
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuiasPrestamoRoutingModule { }
