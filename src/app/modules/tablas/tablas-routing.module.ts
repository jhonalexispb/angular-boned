import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablasComponent } from './tablas.component';

const routes: Routes = [
  {
    path: '',
    component: TablasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablasRoutingModule { }
