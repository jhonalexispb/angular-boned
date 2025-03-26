import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProveedorService } from '../service/service-proveedor.service';
import { CreateLaboratoriosComponent } from '../../atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';

@Component({
  selector: 'app-create-proveedor-laboratorio',
  templateUrl: './create-proveedor-laboratorio.component.html',
  styleUrls: ['./create-proveedor-laboratorio.component.scss']
})
export class CreateProveedorLaboratorioComponent {
  @Output() LaboratorioProveedorC:EventEmitter<any> = new EventEmitter();
  @Input() PROVEEDOR_ID: any = '';
  @Input() name: any = '';
  @Input() LABORATORIOS_LIST:any[] = [];

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
      laboratorio_id: [null,[Validators.required]],
      margen_minimo: ['', [Validators.required]]
    });
  }

  onLaboratorioChange(laboratorioId: any) {
    if(!laboratorioId){
      this.LaboratorioProveedorForm.patchValue({
        margen_minimo: ''
      });

      return
    }
    const laboratorio = this.LABORATORIOS_LIST.find(lab => lab.id === laboratorioId.id);
    if (laboratorio) {
      this.LaboratorioProveedorForm.patchValue({
        margen_minimo: laboratorio.margen_minimo
      });
    }
  }

  store(){
    this.proveedorService.registrarRelacionLaboratorioProveedor(this.LaboratorioProveedorForm.value).subscribe({
      next: (resp: any) => {
          this.LaboratorioProveedorC.emit(resp.relacion);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'la relacion se registró correctamente');
      },
    });
  }

  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nombre_externo = this.searchTermLaboratorio;
    modalRef.componentInstance.LaboratorioC.subscribe((r: any) => {
      this.LABORATORIOS_LIST = [r, ...this.LABORATORIOS_LIST];
      this.LaboratorioProveedorForm.patchValue({ laboratorio_id: r.id });
      this.onLaboratorioChange(r)
    });
  }
}
