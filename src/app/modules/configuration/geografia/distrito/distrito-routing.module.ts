import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistritoComponent } from './distrito.component';

const routes: Routes = [
  {
    path:'list',
    component: DistritoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistritoRoutingModule { }
