import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    ListUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,

    HttpClientModule, //peticiones
    FormsModule,
    NgbModule,
    ReactiveFormsModule, //formulario reactivo
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    DataTablesModule,
  ]
})
export class UsersModule { }
