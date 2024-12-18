import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeografiaComponent } from './geografia.component';
import { ProvinciaComponent } from './provincia/provincia.component';
import { DistritoComponent } from './distrito/distrito.component';
import { DepartamentoComponent } from './departamento/departamento.component';

const routes: Routes = [
  {
      path: '',
      component: GeografiaComponent,
      children: [
        {
          path: 'departamento',
          component: DepartamentoComponent,
          loadChildren: () => import('./departamento/departamento.module').then(m => m.DepartamentoModule)
        },
        {
          path: 'provincia',
          component: ProvinciaComponent,
          loadChildren: () => import('./provincia/provincia.module').then(m => m.ProvinciaModule)
        },
        {
          path: 'distrito',
          component: DistritoComponent,
          loadChildren: () => import('./distrito/distrito.module').then(m => m.DistritoModule)
        },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeografiaRoutingModule { }
