import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalClienteService } from '../service/sucursalCliente.service';

@Component({
  selector: 'app-gestionar-sucursales',
  templateUrl: './gestionar-sucursales.component.html',
  styleUrls: ['./gestionar-sucursales.component.scss']
})
export class GestionarSucursalesComponent {
  @Output() ClienteGestionE: EventEmitter<any> = new EventEmitter();
  @Input() CLIENTE_SUCURSAL_TO_SELECTED: any = [];
  clienteGestionarSucursalForm: FormGroup;
  sweet:any = new SweetalertService
  T_FACTURACION:any[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public clienteSucursalService: SucursalClienteService
  ) {}

  ngOnInit(): void {
    this.clienteGestionarSucursalForm = this.fb.group({
      formaPago: [null, [Validators.required]],
      dias: [null, [Validators.required]],
      modo_facturacion_id: [null, [Validators.required]],
      linea_Credito: [this.CLIENTE_SUCURSAL_TO_SELECTED.linea_credito, [Validators.required]],
    });
    this.clienteSucursalService.obtenerRecursosParaGestionar(this.CLIENTE_SUCURSAL_TO_SELECTED.id).subscribe((data: any) => {
      this.T_FACTURACION = data.modos_facturacion;

      this.clienteGestionarSucursalForm.get('formaPago')?.reset(data.datos_sucursal.forma_pago);
      this.clienteGestionarSucursalForm.get('dias')?.reset(data.datos_sucursal.dias);
      this.clienteGestionarSucursalForm.get('modo_facturacion_id')?.reset(data.datos_sucursal.modo_facturacion);
    });
  }

  onSubmit() {
    if (this.clienteGestionarSucursalForm.invalid) {
      return;
    }

    console.log(this.clienteGestionarSucursalForm.value)
    
    this.clienteSucursalService.updateSucursalCliente(this.CLIENTE_SUCURSAL_TO_SELECTED.id,this.clienteGestionarSucursalForm.value).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 409) {
          this.sweet.alert('Atencion', resp.message_text);
        } else {
          this.ClienteGestionE.emit(resp.cliente_sucursal);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'la sucursal se registró correctamente'
          );
        }
      },
    })
  }   
}
