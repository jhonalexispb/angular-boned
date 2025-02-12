import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CondicionesAlmacenamientoRoutingModule } from './condiciones-almacenamiento-routing.module';
import { LisCondicionesAlmacenamientoComponent } from './lis-condiciones-almacenamiento/lis-condiciones-almacenamiento.component';
import { EditCondicionesAlmacenamientoComponent } from './edit-condiciones-almacenamiento/edit-condiciones-almacenamiento.component';
import { CreateCondicionesAlmacenamientoComponent } from './create-condiciones-almacenamiento/create-condiciones-almacenamiento.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ButtonsGroupListModule } from 'src/app/components/buttons-group-list/buttons-group-list.module';
import { PaginationModule } from 'src/app/components/pagination/pagination.module';


@NgModule({
  declarations: [
    LisCondicionesAlmacenamientoComponent,
    EditCondicionesAlmacenamientoComponent,
    CreateCondicionesAlmacenamientoComponent
  ],
  imports: [
    CommonModule,
    CondicionesAlmacenamientoRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    PaginationModule,
    ButtonsGroupListModule,
  ]
})
export class CondicionesAlmacenamientoModule { }
