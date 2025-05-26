import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import L from 'leaflet';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { TransporteOrdenVentaService } from '../service/transporte-orden-venta.service';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl: 'assets/images/marker-icon-2x.png',
  iconUrl: 'assets/images/marker-icon.png',
  shadowUrl: 'assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});


@Component({
  selector: 'app-edit-transporte-orden-venta',
  templateUrl: './edit-transporte-orden-venta.component.html',
  styleUrls: ['./edit-transporte-orden-venta.component.scss']
})
export class EditTransporteOrdenVentaComponent {
  @Output() TransporteOrdenVentaE:EventEmitter<any> = new EventEmitter();
  @Input() TRANSPORTE_ORDEN_VENTA_SELECTED:any = [];
  name:string = '';
  razonSocial:string = '';
  address:string = '';
  celular:string = '';
  ruc:string;
  loading:boolean
  solicita_guia:string = '';
  state:boolean

  latitud: number | null = null;
  longitud: number | null = null;
  coordenadas: string = '';

  private map: any;
  private marker: any;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([-12.0464, -77.0428], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.latitud = lat;
      this.longitud = lng;
      this.coordenadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });

    this.latitud = this.TRANSPORTE_ORDEN_VENTA_SELECTED.latitud ? Number(this.TRANSPORTE_ORDEN_VENTA_SELECTED.latitud) : null;
    this.longitud = this.TRANSPORTE_ORDEN_VENTA_SELECTED.longitud ? Number(this.TRANSPORTE_ORDEN_VENTA_SELECTED.longitud) : null;


    // Dibuja coordenadas si ya existen
    if (this.latitud != null && this.longitud != null) {
      const latLng = L.latLng(this.latitud, this.longitud);
      this.marker = L.marker(latLng).addTo(this.map)
        .bindPopup("Ubicación actual del transporte").openPopup();
      this.map.setView(latLng, 15);

      setTimeout(() => {
        const latFixed = this.latitud!.toFixed(6);
        const lngFixed = this.longitud!.toFixed(6);
        this.coordenadas = `${latFixed}, ${lngFixed}`;
      });
    }
  }

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    //llamamos al servicio
    public TransporteService: TransporteOrdenVentaService,
  ){

  }

  ngOnInit(): void {
    this.loading = true
    this.name = this.TRANSPORTE_ORDEN_VENTA_SELECTED.name
    this.razonSocial = this.TRANSPORTE_ORDEN_VENTA_SELECTED.razonSocial
    this.address = this.TRANSPORTE_ORDEN_VENTA_SELECTED.direccion
    this.celular = this.TRANSPORTE_ORDEN_VENTA_SELECTED.celular
    this.ruc = this.TRANSPORTE_ORDEN_VENTA_SELECTED.ruc
    this.solicita_guia = this.TRANSPORTE_ORDEN_VENTA_SELECTED.solicita_guia
    this.latitud = this.TRANSPORTE_ORDEN_VENTA_SELECTED.latitud
    this.longitud = this.TRANSPORTE_ORDEN_VENTA_SELECTED.longitud
    this.state = this.TRANSPORTE_ORDEN_VENTA_SELECTED.state
  }

  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del transporte es requerido");
      return false;
    }

    if (this.solicita_guia === null || this.solicita_guia === undefined) {
      this.sweet.formulario_invalido("Validación", "Selecciona si el transporte solicita guía de remisión");
      return false;
    }

    const data = {
      'ruc': this.ruc,
      'razonSocial': this.razonSocial,
      'name': this.name,
      'direccion':this.address,
      'celular':this.celular,
      'latitud': this.latitud,
      'longitud': this.longitud,
      'solicita_guia':this.solicita_guia,
      'state':this.state,
    };

    this.TransporteService.actualizar_transporte_orden_venta(data, this.TRANSPORTE_ORDEN_VENTA_SELECTED.id).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        this.TransporteOrdenVentaE.emit(resp.transporte);
        this.modal.close();
        this.sweet.success('¡Éxito!', 'el transporte se actualizo correctamente');
      },
    });
  }

  obtenerUbicacionActual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.latitud = lat;
          this.longitud = lng;
          this.coordenadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          if (this.marker) {
            this.map.removeLayer(this.marker);
          }

          this.marker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup("¡Estás aquí!").openPopup();

          this.map.setView([lat, lng], 15);
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  }

  buscarRazonSocial() {
    this.razonSocial = '';
    this.address = '';
    this.TransporteService.obtenerRazonSocial(this.ruc).subscribe({
      next: (resp: any) => {
        this.sweet.success('¡Bien!',`dale un saludo a ${resp.razonSocial}`);
        this.razonSocial = resp.razonSocial;
        this.address = `${resp.response.direccion}, DISTRITO: ${resp.response.distrito}, PROVINCIA: ${resp.response.provincia}, DEPARTAMENTO: ${resp.response.departamento}`;
      },
    })
  }
}
