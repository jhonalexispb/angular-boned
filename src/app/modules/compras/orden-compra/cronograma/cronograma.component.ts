import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CreateEventoComponent } from './create-evento/create-evento.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { EditEventoComponent } from './edit-evento/edit-evento.component';

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

  totalMonto: number = 0;
  totalPendiente: number = 0;
  cuotas:number  = 0
  proveedor:string;
  sweet:any = new SweetalertService

  @ViewChild('calendar') calendarComponent: any;

  ngOnInit():void {
    const formGuardado = localStorage.getItem('compra_form');
    if (formGuardado) {
      const valoresRecuperados = JSON.parse(formGuardado);
      this.proveedor = valoresRecuperados.proveedor_name
      this.totalMonto = valoresRecuperados.total
      this.totalPendiente = valoresRecuperados.total

      const eventoGuardado = localStorage.getItem('eventos_compra_cuotas');
      if (eventoGuardado) {
        const eventos = JSON.parse(eventoGuardado);
        this.cuotas = eventos.length;
        const total = eventos.reduce((acc:any, evento:any) => acc + (evento.extendedProps?.amount || 0), 0);
        this.totalPendiente = this.totalMonto - total;
        const valoresRecuperados = JSON.parse(eventoGuardado);
        this.calendarOptions = {...this.calendarOptions,...{events: valoresRecuperados}};
      }
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
    dayMaxEventRows: 2,
    eventDidMount: (info) => {
      info.el.style.whiteSpace = 'wrap';
      info.el.style.fontSize = '10px';
      info.el.style.overflow = 'hidden';
      info.el.style.textOverflow = 'ellipsis';
    }
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
      this.sweet.success('Bien','la cuota se genero de manera satisfactoria')
    });
  }

  addEventToCalendar(newEvent: any) {
    this.calendarOptions.events = [...(Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : []), newEvent];
    if (this.calendarComponent) {
      this.cuotas++
      const eventoGuardado = localStorage.getItem('eventos_compra_cuotas');
      if (eventoGuardado) {
        const eventos = JSON.parse(eventoGuardado);
        this.cuotas = eventos.length;
        const total = eventos.reduce((acc:any, evento:any) => acc + (evento.extendedProps?.amount || 0), 0);
        this.totalPendiente = this.totalMonto - total;
      }
      this.cdRef.detectChanges();
    }
  }

  openEditEventModal(event:any) {
    const modalRef = this.modalService.open(EditEventoComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.EVENTO_SELECTED = event
    // Pasar la fecha seleccionada al modal

    // Escuchar el evento emitido desde el componente hijo
    modalRef.componentInstance.eventEdit.subscribe((eventData:any) => {
      this.addEventToCalendar(eventData);
      this.sweet.success('Bien','la cuota se actualizo de manera satisfactoria')
    });
  }

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  updateEvent(event: any) {
    let eventosGuardados = JSON.parse(localStorage.getItem('eventos_compra_cuotas') || '[]');
    const index = eventosGuardados.findIndex((eventoGuardado: any) => Number(eventoGuardado.id) === Number(event.id));

    if (index !== -1) {
      // Actualizamos las propiedades del evento, como la fecha de inicio
      eventosGuardados[index].start = event.start.toISOString();
    }
  
    // Guardar los eventos actualizados en localStorage
    localStorage.setItem('eventos_compra_cuotas', JSON.stringify(eventosGuardados));
  
    // También puedes emitir el evento actualizado si es necesario
    console.log('Evento actualizado en LocalStorage:', event);
  }
}
