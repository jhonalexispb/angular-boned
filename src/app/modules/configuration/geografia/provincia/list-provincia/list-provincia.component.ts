import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProvinciaService } from '../service/service-provincia.service';
import { EditProvinciaComponent } from '../edit-provincia/edit-provincia.component';
import { CreateProvinciaComponent } from '../create-provincia/create-provincia.component';

@Component({
  selector: 'app-list-provincia',
  templateUrl: './list-provincia.component.html',
  styleUrls: ['./list-provincia.component.scss'],
})
export class ListProvinciaComponent {
  search: string = '';
  PROVINCIAS: any = [];
  DEPARTAMENTOS: any[] = [];
  sweet: any = new SweetalertService();
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public provinciaService: ServiceProvinciaService
  ) {}

  ngOnInit(): void {
    this.listProvincia();
  }

  listProvincia(page = 1) {
    this.provinciaService
      .listProvincia(page, this.search)
      .subscribe((resp: any) => {
        this.PROVINCIAS = resp.provincia;
        this.totalPages = resp.total;
        this.DEPARTAMENTOS = resp.departamentos;
        this.currentPage = page;
      });
  }

  loadPage(page: number) {
    this.listProvincia(page);
  }

  editProvincia(PROV: any) {
    const modalRef = this.modalService.open(EditProvinciaComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.PROVINCIA_SELECTED = PROV;
    modalRef.componentInstance.DEPARTAMENTOS = this.DEPARTAMENTOS;
    modalRef.componentInstance.ProvinciaE.subscribe((prov: any) => {
      const { provincia, isRestored } = prov;
      if (isRestored) {
        this.PROVINCIAS.unshift(provincia);
      } else {
        let INDEX = this.PROVINCIAS.findIndex((b: any) => b.id == PROV.id);
        if (INDEX != -1) {
          this.PROVINCIAS[INDEX] = provincia;
        }
      }
    });
  }

  createProvincia() {
    const modalRef = this.modalService.open(CreateProvinciaComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.DEPARTAMENTOS = this.DEPARTAMENTOS;
    modalRef.componentInstance.ProvinciaC.subscribe((prov: any) => {
      this.PROVINCIAS.unshift(prov); //integra el nuevo valor al inicio de la tabla
    });
  }

  deleteProvincia(PROVINCIA: any) {
    this.sweet
      .confirmar_borrado(
        '¿Estás seguro?',
        `¿Deseas eliminar la provincia: ${PROVINCIA.name}?`
      )
      .then((result: any) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
          this.provinciaService.deleteProvincia(PROVINCIA.id).subscribe({
            next: (resp: any) => {
              this.PROVINCIAS = this.PROVINCIAS.filter(
                (b: any) => b.id !== PROVINCIA.id
              ); // Eliminamos el rol de la lista
              this.sweet.success(
                'Eliminado',
                `la provincia ${PROVINCIA.name} ha sido eliminada correctamente`,
                '/assets/animations/general/borrado_exitoso.json'
              );
            },
          });
        }
      });
  }
}
