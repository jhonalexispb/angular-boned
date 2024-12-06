import { Component, OnInit } from '@angular/core';
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
}
