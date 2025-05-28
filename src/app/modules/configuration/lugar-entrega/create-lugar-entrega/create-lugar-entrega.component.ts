import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';
import { LugarEntregaService } from '../service/lugar-entrega.service';
import * as L from 'leaflet';

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
  selector: 'app-create-lugar-entrega',
  templateUrl: './create-lugar-entrega.component.html',
  styleUrls: ['./create-lugar-entrega.component.scss']
})
export class CreateLugarEntregaComponent {
  @Input() sucursal: any;
  @Output() LugarEntregaC:EventEmitter<any> = new EventEmitter();
  coordenadas:string = '';

  sweet:any = new SweetalertService

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public lugarEntregaService: LugarEntregaService,
  ){

  }

  private map: any;
  private marker: any;
  latitud: number | null = null;
  longitud: number | null = null;
  address:string = '';
  distrito:any
  imagen: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;

  ngAfterViewInit(): void {
    // Inicializar el mapa
    this.map = L.map('map_lugar').setView([-12.0464, -77.0428], 13); // Ej: Lima
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
      this.obtener_distrito(lat,lng)
    });
  }

  ngOnInit(): void {

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
          this.obtener_distrito(lat,lng)
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

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.imagen = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(this.imagen);
    }
  }

  obtener_distrito(lat:any,lng:any){
    this.distrito = null;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
    .then(res => res.json())
    .then(data => {
      const distrito = data.address.city;
      this.distrito = distrito;
    })
    .catch(err => {
      console.error("Error al obtener la dirección:", err);
      /* alert("No se pudo obtener la dirección exacta."); */
    });
  }


 store() {
    if (!this.sucursal) {
      this.sweet.alerta('Eyy', 'no hay una sucursal seleccionada');
      return;
    }

    if (!this.address) {
      this.sweet.alerta('Eyy', 'la direccion es obligatoria');
      return;
    }

    const formData = new FormData();
    formData.append('sucursal_id', this.sucursal.toString());
    formData.append('address', this.address);
    formData.append('distrito', this.distrito || '');
    formData.append('latitud', this.latitud?.toString() || '');
    formData.append('longitud', this.longitud?.toString() || '');

    // Solo si hay imagen
    if (this.imagen) {
      formData.append('imagen_lugar', this.imagen);
    }

    this.lugarEntregaService.registerLugarEntrega(formData).subscribe({
      next: (resp: any) => {
        this.LugarEntregaC.emit(resp.lugarEntrega);
        this.modal.close();
        this.sweet.success('¡Éxito!', 'El lugar de entrega se registró correctamente');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Limpia completamente el mapa y su contenedor
      this.map = null;
    }
  }
}
