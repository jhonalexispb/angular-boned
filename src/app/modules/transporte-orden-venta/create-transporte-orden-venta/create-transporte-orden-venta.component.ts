import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceProveedorService } from '../../configuration/proveedor/service/service-proveedor.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import * as L from 'leaflet';
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
  selector: 'app-create-transporte-orden-venta',
  templateUrl: './create-transporte-orden-venta.component.html',
  styleUrls: ['./create-transporte-orden-venta.component.scss']
})


export class CreateTransporteOrdenVentaComponent {
  @Output() ProveedorC:EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo:any = '';
  name:string = '';
  razonSocial:string = '';
  address:string = '';
  celular:string = '';
  representante:null;
  ruc:string;
  loading:boolean
  solicita_guia:string = '';

  latitud: number | null = null;
  longitud: number | null = null;
  coordenadas: string = '';

  private map: any;
  private marker: any;

  ngAfterViewInit(): void {
    // Inicializar el mapa
    this.map = L.map('map').setView([-12.0464, -77.0428], 13); // Ej: Lima
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Evento click para seleccionar coordenadas
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.latitud = lat;
      this.longitud = lng;
      this.coordenadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      // Mostrar marcador
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });
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
    this.name = this.nombre_externo
  }

  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del transporte es requerido");
      return false;
    }

    if(!this.solicita_guia){
      this.sweet.formulario_invalido("Validacion","selecciona si el transporte solicita guia de remision");
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
    };

    this.TransporteService.crear_transporte_orden_venta(data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        this.ProveedorC.emit(resp.transportes);
        this.modal.close();
        this.sweet.success('¡Éxito!', 'el transporte se creo correctamente');
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
