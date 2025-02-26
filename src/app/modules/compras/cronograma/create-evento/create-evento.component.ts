import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      name: ['',[Validators.required]],
      monto: ['', [Validators.required]],
      comentario: ['', [Validators.required]],
      fecha_pago: [this.eventDate, [Validators.required]],
      dias_despues: [8, [Validators.required]],
      fecha_recordatorio: ['', [Validators.required]],
    });
    this.calcularRecordatorios()
  }

  submitEvent() {
    /* if (this.eventName && this.eventAmount !== null && this.eventDate) {
      // Formatear los datos para FullCalendar
      const eventData = {
        title: this.eventName,
        start: this.eventDate,
        allDay: true,
        className: 'bg-primary text-white',
        extendedProps: {
          amount: this.eventAmount,
          notes: this.eventNotes,
          reminder: this.sendReminder
        }
      };

      console.log('Evento creado:', eventData);

      // Emitir el evento usando @Output
      this.eventCreated.emit(eventData);

      // Cerrar el modal
      this.modal.close();
    } else {
      console.log('Faltan campos obligatorios');
    } */
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
        console.log('beba')
    }
  }

  // Función para formatear fecha en YYYY-MM-DD
  formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
  }
}
