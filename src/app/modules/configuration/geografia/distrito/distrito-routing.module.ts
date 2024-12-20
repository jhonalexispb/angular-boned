import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistritoComponent } from './distrito.component';
import { ListDistritoComponent } from './list-distrito/list-distrito.component';

const routes: Routes = [
  {
    path:'',
    component: DistritoComponent,
    children: [
      {
        path:'list',
        component: ListDistritoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistritoRoutingModule { }
