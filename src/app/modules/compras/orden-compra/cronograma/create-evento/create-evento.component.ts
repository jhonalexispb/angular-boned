import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
  @Input() ncuotas:number = 0

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      name: [`CUOTA #${this.ncuotas} PARA ${this.proveedor}`,[Validators.required]],
      monto: ['', [Validators.required]],
      comentario: [''],
      fecha_pago: [this.eventDate, [Validators.required]],
      dias_despues: [8, [Validators.required]],
      fecha_recordatorio: ['', [Validators.required]],
    });
    this.calcularRecordatorios()
  }

  submitEvent() {
    if (this.eventoForm.valid) {
      const evento = {
        title: this.eventoForm.get('name')?.value,
        start: this.eventoForm.get('fecha_pago')?.value,
        allDay: true,
        className: 'bg-primary text-white',
        extendedProps: {
          amount: this.eventoForm.get('monto')?.value,
          notes: this.eventoForm.get('comentario')?.value,
          reminder: this.eventoForm.get('fecha_recordatorio')?.value
        }
      };
  
      // Obtener los eventos actuales desde el LocalStorage
      let eventosGuardados = JSON.parse(localStorage.getItem('eventos_compra_cuotas') || '[]');
      
      // Agregar el nuevo evento a la lista de eventos
      eventosGuardados.push(evento);
      
      // Guardar la lista actualizada de eventos en el LocalStorage
      localStorage.setItem('eventos_compra_cuotas', JSON.stringify(eventosGuardados));
      
      // Emitir el evento si es necesario
      this.eventCreated.emit(evento);
  
      // Cerrar el modal
      this.modal.close();
    } else {
      return
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
