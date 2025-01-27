import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtributtesProductsComponent } from './atributtes-products.component';
import { LaboratoriosComponent } from './laboratorios/laboratorios.component';
import { PrincipiosActivosComponent } from './principios-activos/principios-activos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { FabricantesComponent } from './fabricantes/fabricantes.component';
import { LineasFarmaceuticasComponent } from './lineas-farmaceuticas/lineas-farmaceuticas.component';

const routes: Routes = [
  {
    path: '',
    component: AtributtesProductsComponent,
    children: [
      {
        path: 'laboratorios',
        component: LaboratoriosComponent,
        loadChildren: () => import('./laboratorios/laboratorios.module').then(m => m.LaboratoriosModule)
      },
      {
        path: 'principios-activos',
        component: PrincipiosActivosComponent,
        loadChildren: () => import('./principios-activos/principios-activos.module').then(m => m.PrincipiosActivosModule)
      },
      {
        path: 'categorias',
        component: CategoriasComponent,
        loadChildren: () => import('./categorias/categorias.module').then(m => m.CategoriasModule)
      },
      {
        path: 'fabricantes-productos',
        component: FabricantesComponent,
        loadChildren: () => import('./fabricantes/fabricantes.module').then(m => m.FabricantesModule)
      },
      {
        path: 'lineas-farmaceuticas',
        component: LineasFarmaceuticasComponent,
        loadChildren: () => import('./lineas-farmaceuticas/lineas-farmaceuticas.module').then(m => m.LineasFarmaceuticasModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtributtesProductsRoutingModule { }
