import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComprobanteComponent } from './list-comprobante/list-comprobante.component';

const routes: Routes = [
  {
    path:'list',
    component: ListComprobanteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteRoutingModule { }
