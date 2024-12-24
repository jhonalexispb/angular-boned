import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import lottie from 'lottie-web';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SweetRestaurarRepresentante {
  private restaurarSubject = new Subject<boolean>();
  private user: any = null;

  constructor() {
    this.loadUser();
  }

  getRestauracionObservable() {
    return this.restaurarSubject.asObservable();
  }

  private loadUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData); // Guardamos el usuario en la propiedad
      this.user = this.user.name;
    }else{
      this.user = ''
    }
  }

  // Función auxiliar para manejar la animación Lottie y los estilos
  private loadLottieAnimation(containerId: string, animationPath: string) {
    const lottieContainer = document.getElementById(containerId);
    if (lottieContainer) {
      // Usar lottie directamente
      const animation = lottie.loadAnimation({
        container: lottieContainer,  // El contenedor de la animación
        path: animationPath,  // Ruta de la animación JSON
        renderer: 'svg',  // Renderizador SVG
        loop: true,  // Hacer que la animación se repita
        autoplay: true,  // Iniciar automáticamente
      });
    }
  }

  // Función auxiliar para cambiar los estilos de la alerta
  private updateAlertStyles() {
    const swal2Container = document.querySelector('.swal2-container');
    const swal2HtmlContainer = document.querySelector('.swal2-html-container');

    if (swal2HtmlContainer) {
      swal2HtmlContainer.setAttribute('style', 'max-height: none');
    }
    
    if (swal2Container) {
      swal2Container.setAttribute('style', 'display: flex; justify-content: center; align-items: center;');
    }
  }

  confirmar_restauracion(title: string, text: string, image:string = '/assets/animations/general/ojitos.json') {
      return Swal.fire({
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: 'Sí, restauremoslo',
        cancelButtonText: 'Cancelar',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
          <div id="lottie-container" style="width: 200px; height: 200px; margin: auto;"></div>
          <p style="text-align: center; margin-top: 10px;">${this.user}, ${text}</p>
        </div>`,
        didOpen: () => {
          this.loadLottieAnimation('lottie-container', image);
        },
        willOpen: () => {
          // Llamamos a la función auxiliar para actualizar los estilos
          this.updateAlertStyles();
        }
      }).then((result) => {
        // Emitimos la confirmación según la acción del usuario
        if (result.isConfirmed) {
          this.restaurarSubject.next(true);  // Emitimos 'true' si el usuario confirma
        } else {
          this.restaurarSubject.next(false);  // Emitimos 'false' si el usuario cancela
        }
      });
    }
}