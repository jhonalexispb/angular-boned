import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { components } from 'src/app/_metronic/kt';
import { ListRolesComponent } from './list-roles/list-roles.component';

const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    children: [
      {
        path: 'list',
        component: ListRolesComponent
      },
      /* 
      El register sera un modal por loq ue no se necesita una ruta para esto
      {
        path: 'register',
        component: ListRolesComponent
      }, */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
