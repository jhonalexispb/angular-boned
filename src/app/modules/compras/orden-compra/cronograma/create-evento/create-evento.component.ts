import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-create-evento',
  templateUrl: './create-evento.component.html',
  styleUrls: ['./create-evento.component.scss']
})
export class CreateEventoComponent {
  eventoForm: FormGroup;
  
  @Output() eventCreated = new EventEmitter<any>(); // Definir el @Output
  @Input() eventDate:any
  @Input() proveedor:any
  @Input() MONTO_PENDIENTE:any
  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      name: [`${this.proveedor}`,[Validators.required]],
      monto: ['', [Validators.required]],
      comentario: [''],
      fecha_pago: [{ value: this.eventDate, disabled: true }, [Validators.required]],
      dias_despues: [8, [Validators.required]],
      fecha_recordatorio: ['', [Validators.required]],
    });
    this.MONTO_PENDIENTE = parseFloat(this.MONTO_PENDIENTE.toFixed(2));
    this.calcularRecordatorios()
  }

  submitEvent() {
    if(this.eventoForm.get('monto')?.value > this.MONTO_PENDIENTE){
      this.sweet.alerta('Alto ahi','el monto ingresado supera al monto pendiente')
      return
    }
    if (this.eventoForm.valid) {
      let eventosGuardados = JSON.parse(localStorage.getItem('eventos_compra_cuotas') || '[]');
      let nuevoId = eventosGuardados.length > 0 ? eventosGuardados[eventosGuardados.length - 1].id + 1 : 1;
  
      const evento = {
        id: nuevoId, // ID autoincremental
        title: this.eventoForm.get('name')?.value,
        start: this.eventoForm.get('fecha_pago')?.value,
        allDay: true,
        className: 'bg-primary text-white',
        extendedProps: {
          amount: this.eventoForm.get('monto')?.value,
          notes: this.eventoForm.get('comentario')?.value,
          dias_reminder: this.eventoForm.get('dias_despues')?.value,
          reminder: this.eventoForm.get('fecha_recordatorio')?.value
        }
      };
  
      eventosGuardados.push(evento);
      localStorage.setItem('eventos_compra_cuotas', JSON.stringify(eventosGuardados));
  
      this.eventCreated.emit(evento);
      this.modal.close();
    }
  }

  calcularRecordatorios() {
    const fechaPago = this.eventoForm.get('fecha_pago')?.value;
    const diasDespues = this.eventoForm.get('dias_despues')?.value;

    if(!diasDespues){
      this.eventoForm.patchValue({fecha_recordatorio : null})
      return
    }

    if (fechaPago) {
        const fechaPagoDate = new Date(fechaPago);

        // Recordatorio 3 (Días después)
        const despuesDate = new Date(fechaPagoDate);
        despuesDate.setDate(despuesDate.getDate() + parseInt(diasDespues, 10));
        const dia_formateado = this.formatDate(despuesDate)
        this.eventoForm.patchValue({fecha_recordatorio : dia_formateado})
    }
  }

  formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
  }
}
