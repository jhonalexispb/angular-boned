import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { RolesService } from './service/roles.service';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss']
})
export class TablasComponent implements OnInit {
  @ViewChild('editTmpl', { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl', { static: true }) hdrTpl: TemplateRef<any>;

  data = [];
  // Definir la estructura correcta de las columnas
  cols = [
    {
      name: 'Title',  // Título de la columna
      prop: 'id'      // Usar 'prop' para asignar el campo del modelo
    },
    {
      name: 'Nombre',
      prop: 'name'
    },
    {
      name: 'Fecha Creación',
      prop: 'created_format_at'
    },
    {
      name: 'Permisos',
      prop: 'permission_pluck'
    }
  ];

  ColumnMode = ColumnMode;

  constructor(public rolesService: RolesService) {}

  ngOnInit(): void {
    this.listRoles();
  }

  listRoles() {
    this.rolesService.listRoles().subscribe((resp: any) => {
      this.data = resp.roles;  // Asegúrate de acceder a 'roles' directamente
      console.log(this.data)
    });
  }
}












































/* import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss']
})
export class TablasComponent implements OnInit {

  dtTrigger: Subject<any> = new Subject<any>(); 


  ngOnInit(): void {
    $(document).ready(function () {
      if ($.fn.dataTable.isDataTable('#example')) {
        $('#example').DataTable().clear().destroy();
      }
      $('#example').DataTable({
        paging: true,
        searching: false,
        ordering: true,
        info: true,
        lengthChange: true,
        pageLength: 5,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-MX.json'
        },
        order: [[0, 'asc']],
        responsive: true,
        columnDefs: [
          {
            targets: [1, 2],  // Ocultar columnas específicas en pantallas pequeñas
            visible: false
          }
        ]
      });
    });
  }

  ngOnDestroy(): void {
    // Asegurarse de destruir el DataTable para evitar fugas de memoria
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }
} */
