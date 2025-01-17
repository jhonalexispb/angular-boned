import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceDepartamentoService } from '../service/service-departamento.service';
import { EditDepartamentoComponent } from '../edit-departamento/edit-departamento.component';
import { CreateDepartamentoComponent } from '../create-departamento/create-departamento.component';

@Component({
  selector: 'app-list-departamento',
  templateUrl: './list-departamento.component.html',
  styleUrls: ['./list-departamento.component.scss'],
})
export class ListDepartamentoComponent {
  search: string = '';
  DEPARTAMENTOS: any = [];
  sweet: any = new SweetalertService();

  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public departamentoService: ServiceDepartamentoService
  ) {}

  ngOnInit(): void {
    this.listDepartamento();
  }

  listDepartamento(page = 1) {
    this.departamentoService
      .listDepartamento(page, this.search)
      .subscribe((resp: any) => {
        this.DEPARTAMENTOS = resp.departamento;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }

  loadPage(page: number) {
    this.listDepartamento(page);
  }

  editDepartamento(DEP: any) {
    const modalRef = this.modalService.open(EditDepartamentoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.DEPARTAMENTO_SELECTED = DEP;
    modalRef.componentInstance.DepartamentoE.subscribe((dep: any) => {
      const { departamento, isRestored } = dep;
      if (isRestored) {
        this.DEPARTAMENTOS.unshift(departamento);
      } else {
        let INDEX = this.DEPARTAMENTOS.findIndex((b: any) => b.id == DEP.id);
        if (INDEX != -1) {
          this.DEPARTAMENTOS[INDEX] = departamento;
        }
      }
    });
  }

  createDepartamento() {
    const modalRef = this.modalService.open(CreateDepartamentoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.DepartamentoC.subscribe((dep: any) => {
      this.DEPARTAMENTOS.unshift(dep); //integra el nuevo valor al inicio de la tabla
    });
  }

  deleteDepartamento(DEPARTAMENTO: any) {
    this.sweet
      .confirmar_borrado(
        '¿Estás seguro?',
        `¿Deseas eliminar el departamento: ${DEPARTAMENTO.name}?`
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
          this.departamentoService
            .deleteDepartamento(DEPARTAMENTO.id)
            .subscribe({
              next: () => {
                this.DEPARTAMENTOS = this.DEPARTAMENTOS.filter(
                  (b: any) => b.id !== DEPARTAMENTO.id
                ); // Eliminamos el rol de la lista
                this.sweet.success(
                  'Eliminado',
                  'el departamento ha sido eliminado correctamente',
                  '/assets/animations/general/borrado_exitoso.json'
                );
              },
            });
        }
      });
  }
}
