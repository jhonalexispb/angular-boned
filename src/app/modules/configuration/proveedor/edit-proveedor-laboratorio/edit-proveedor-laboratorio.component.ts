import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateLaboratoriosComponent } from '../../atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { ServiceProveedorService } from '../service/service-proveedor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-proveedor-laboratorio',
  templateUrl: './edit-proveedor-laboratorio.component.html',
  styleUrls: ['./edit-proveedor-laboratorio.component.scss']
})
export class EditProveedorLaboratorioComponent {
  @Output() LaboratorioProveedorE:EventEmitter<any> = new EventEmitter();
  @Input() PROVEEDOR_ID: any = '';
  @Input() name: any = '';
  @Input() LABORATORIOS_LIST:any[] = [];
  @Input() RELACION_SELECTED:any;

  LaboratorioProveedorForm: FormGroup;
  searchTermLaboratorio:any

  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public proveedorService: ServiceProveedorService,
    public modalService: NgbModal,
    private fb: FormBuilder,
  ){

  }

  ngOnInit(): void {
    this.loading = true
    this.proveedorService.obtenerLaboratorios(this.PROVEEDOR_ID).subscribe((data: any) => {
      this.LABORATORIOS_LIST = data.laboratorios;
      this.name = data.proveedor
      this.loading = false;
    });
    this.LaboratorioProveedorForm = this.fb.group({
      proveedor_id: [this.PROVEEDOR_ID,[Validators.required]],
      laboratorio_id: [this.RELACION_SELECTED.laboratorio_id,[Validators.required]],
      margen_minimo: [this.RELACION_SELECTED.margen_minimo, [Validators.required]]
    });
  }

  store(){
    this.proveedorService.editarRelacionLaboratorioProveedor(this.LaboratorioProveedorForm.value,this.RELACION_SELECTED.id).subscribe({
      next: (resp: any) => {
          this.LaboratorioProveedorE.emit(resp.relacion);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'la relacion se actualizo correctamente');
      },
    });
  }

  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermLaboratorio;
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS_LIST = [r, ...this.LABORATORIOS_LIST];
      this.LaboratorioProveedorForm.patchValue({ laboratorio_id: r.id });
    });
  }
}
