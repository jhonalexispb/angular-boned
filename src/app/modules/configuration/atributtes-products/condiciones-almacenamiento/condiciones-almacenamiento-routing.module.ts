import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LisCondicionesAlmacenamientoComponent } from './lis-condiciones-almacenamiento/lis-condiciones-almacenamiento.component';

const routes: Routes = [
  {
    path:'list',
    component: LisCondicionesAlmacenamientoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionesAlmacenamientoRoutingModule { }
