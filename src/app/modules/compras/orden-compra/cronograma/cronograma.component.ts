import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CreateEventoComponent } from './create-evento/create-evento.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent {
  constructor(
    public modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {}

  totalMonto: number = 1000;
  cuotas:number  = 0
  proveedor:string;
  sweet:any = new SweetalertService

  @ViewChild('calendar') calendarComponent: any;

  ngOnInit():void {
    const formGuardado = localStorage.getItem('compra_form');
    if (formGuardado) {
      const valoresRecuperados = JSON.parse(formGuardado);
      this.proveedor = valoresRecuperados.proveedor_name
    }

    const eventoGuardado = localStorage.getItem('eventos_compra_cuotas');
    if (eventoGuardado) {
      const eventos = JSON.parse(eventoGuardado);
      this.cuotas = eventos.length;
      const valoresRecuperados = JSON.parse(eventoGuardado);
      this.calendarOptions = {...this.calendarOptions,...{events: valoresRecuperados}};
    }
  }
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    eventDrop: (info) => {
      const movedEvent = info.event;  // El evento que fue movido
      console.log('Evento movido:', movedEvent.title);
      console.log('Nueva fecha de inicio:', movedEvent.start);
      
      // Aquí puedes emitir el nuevo valor del evento
      this.updateEvent(movedEvent);
    },
    dateClick: (info) => {
      this.openAddEventModal(info.dateStr);
    },
    eventClick: (info) => {
      this.openEditEventModal(info.event);
    },
    // Si quieres permitir arrastrar y soltar eventos, puedes agregar la opción "editable"
    editable: true,
    droppable: false, // Permite arrastrar y soltar eventos
    dayMaxEventRows: 3,
  };

  openAddEventModal(date: string) {
    if(!this.proveedor){
      this.sweet.alert('Paremos aqui','No estas trabajando con ningun proveedor')
    }
    const modalRef = this.modalService.open(CreateEventoComponent,{centered:true, size: 'md'})
    // Pasar la fecha seleccionada al modal
    modalRef.componentInstance.eventDate = date;
    modalRef.componentInstance.ncuotas = this.cuotas + 1;
    modalRef.componentInstance.proveedor = this.proveedor;

    // Escuchar el evento emitido desde el componente hijo
    modalRef.componentInstance.eventCreated.subscribe((eventData:any) => {
      this.addEventToCalendar(eventData);
    });
  }

  addEventToCalendar(newEvent: any) {
    this.calendarOptions.events = [...(Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : []), newEvent];
    if (this.calendarComponent) {
      this.calendarComponent.getApi().addEvent(newEvent);
      this.cuotas++
      this.cdRef.detectChanges();
      console.log(this.cuotas)
    }
  }

  openEditEventModal(event:any) {
    console.log('Evento seleccionado:', event);
    // Aquí abrirías el modal para editar el evento
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  updateEvent(event:any) {
    // Aquí podrías hacer lo que necesites, como actualizar el evento en una base de datos
    console.log('Evento actualizado:', event);
    // Ejemplo: enviar el evento actualizado a un servicio o emitir el nuevo valor
  }
}
