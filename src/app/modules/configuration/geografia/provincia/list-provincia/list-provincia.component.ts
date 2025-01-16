import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProvinciaService } from '../service/service-provincia.service';
import { EditProvinciaComponent } from '../edit-provincia/edit-provincia.component';
import { CreateProvinciaComponent } from '../create-provincia/create-provincia.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-provincia',
  templateUrl: './list-provincia.component.html',
  styleUrls: ['./list-provincia.component.scss'],
})
export class ListProvinciaComponent {
  search: string = '';
  PROVINCIAS: any = [];
  DEPARTAMENTOS: any[] = [];
  isLoading$: any;
  sweet: any = new SweetalertService();
  totalPages: number = 0;
  currentPage: number = 1;

  page = 1;
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;

    this.currentPage = this.page;
    this.loadPage(this.page);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  constructor(
    public modalService: NgbModal,
    public provinciaService: ServiceProvinciaService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.provinciaService.isLoading$;
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

  loadPage($event: any) {
    this.listProvincia($event);
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
              if (resp.message === 403) {
                this.sweet.error('Error', resp.message_text);
              } else {
                this.PROVINCIAS = this.PROVINCIAS.filter(
                  (b: any) => b.id !== PROVINCIA.id
                ); // Eliminamos el rol de la lista
                this.sweet.success(
                  'Eliminado',
                  `la provincia ${PROVINCIA.name} ha sido eliminada correctamente`,
                  '/assets/animations/general/borrado_exitoso.json'
                );
              }
            },
            error: (error) => {
              this.sweet.error(error.status);
            },
          });
        }
      });
  }
}
