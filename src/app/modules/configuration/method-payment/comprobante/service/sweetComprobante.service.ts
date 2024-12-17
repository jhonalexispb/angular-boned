import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import lottie from 'lottie-web';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SweetComprobante {
  private confirmationSubject = new Subject<boolean>();
  private user: any = null;

  constructor() {
    this.loadUser();
  }

  getConfirmationObservable() {
    return this.confirmationSubject.asObservable();
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

  // Mostrar una alerta de confirmación (por ejemplo, para eliminar)
  confirmar_estado_deshabilidato(title: string, text: string, image:string = '/assets/animations/configuration-methodPayment-comprobante/advertencia.json') {
    return Swal.fire({
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Sí, deshabilitemoslo',
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
        this.confirmationSubject.next(true);  // Emitimos 'true' si el usuario confirma
      } else {
        this.confirmationSubject.next(false);  // Emitimos 'false' si el usuario cancela
      }
    });
  }
}