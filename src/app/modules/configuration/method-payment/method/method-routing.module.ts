import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMethodComponent } from './list-method/list-method.component';

const routes: Routes = [
  {
    path: 'list', // Ruta para el componente `ListMethodComponent`
    component: ListMethodComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodRoutingModule { }
