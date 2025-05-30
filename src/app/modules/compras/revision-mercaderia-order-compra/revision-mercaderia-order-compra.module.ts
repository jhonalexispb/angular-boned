import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevisionMercaderiaOrderCompraRoutingModule } from './revision-mercaderia-order-compra-routing.module';
import { CheckMercaderiaComponent } from './check-mercaderia/check-mercaderia.component';
import { FacturasGeneradasComponent } from './facturas-generadas/facturas-generadas.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonDropdownOptionModule } from 'src/app/components/button-dropdown-option/button-dropdown-option.module';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { DivLoadingModule } from 'src/app/components/div-loading/div-loading.module';
import { DropImageModule } from 'src/app/components/drop-image/drop-image.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';
import { GestionarMercaderiaCompraComponent } from './gestionar-mercaderia-compra/gestionar-mercaderia-compra.component';
import { CrearLotesComponent } from './crear-lotes/crear-lotes.component';
import { CrearRegistroSanitarioComponent } from './crear-registro-sanitario/crear-registro-sanitario.component';
import { RegistrarComprobanteComponent } from './registrar-comprobante/registrar-comprobante.component';
import { FilterByNombrePipe } from './check-mercaderia/filter-by-nombre.pipe';
import { VerProductoComprobanteComponent } from './ver-producto-comprobante/ver-producto-comprobante.component';
import { SeleccionarComprobanteRegistradoComponent } from './seleccionar-comprobante-registrado/seleccionar-comprobante-registrado.component';


@NgModule({
  declarations: [
    CheckMercaderiaComponent,
    FilterByNombrePipe, 
    FacturasGeneradasComponent,
    GestionarMercaderiaCompraComponent,
    CrearLotesComponent,
    CrearRegistroSanitarioComponent,
    RegistrarComprobanteComponent,
    VerProductoComprobanteComponent,
    SeleccionarComprobanteRegistradoComponent,
  ],
  imports: [
    CommonModule,
    RevisionMercaderiaOrderCompraRoutingModule,
    
    HttpClientModule, //peticiones
    FormsModule,
    NgbModule,
    ReactiveFormsModule, //formulario reactivo
    InlineSVGModule,
    NgbModalModule,
    NgSelectModule,
    ButtonsGroupListModule,
    PaginationModule,
    ButtonDropdownOptionModule,
    DropImageModule,
    DivLoadingModule,
    FullCalendarModule,
  ]
})
export class RevisionMercaderiaOrderCompraModule { }
