import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';  // Asegúrate de que la ruta sea correcta
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PaginationComponent],  // Aquí declaramos el PaginationComponent
  imports: [
    CommonModule,
    NgbPaginationModule
  ],
  exports: [PaginationComponent]  // Aquí lo exportamos para usarlo en otros módulos
})
export class PaginationModule { }
