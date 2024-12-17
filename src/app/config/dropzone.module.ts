import { NgModule } from '@angular/core';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

// Configuración predeterminada de Dropzone
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',  // Cambia esto por la URL de tu backend
  maxFilesize: 50,                  // Tamaño máximo del archivo (en MB)
  acceptedFiles: 'image/*',         // Acepta solo imágenes
  dictDefaultMessage: 'Arrastra tus archivos o haz clic para seleccionar',
  autoProcessQueue: false,          // No procesa automáticamente al subir
  uploadMultiple: false,            // Solo permite un archivo a la vez
  addRemoveLinks: true,             // Añadir enlaces para eliminar archivos
};

@NgModule({
  imports: [DropzoneModule], // Importa DropzoneModule aquí
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG, // Provee la configuración predeterminada
    },
  ],
})
export class DropzoneConfigModule {}