import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import lottie from 'lottie-web';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {
  private restaurarSubject = new Subject<boolean>();
  private confirmationSubject = new Subject<boolean>();
  private user: any = null;

  constructor() {
    this.loadUser();
  }

  getRestauracionObservable() {
    return this.restaurarSubject.asObservable();
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
      lottie.loadAnimation({
        container: lottieContainer,
        path: animationPath,
        renderer: 'svg',
        loop: true,
        autoplay: true,
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

  private createAlert(title: string, text: string, image: string, confirmButtonText: string = 'Aceptar', showCancelButton: boolean = false, cancelButtonText: string = 'Cancelar') {
    return Swal.fire({
      title: title,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      showCancelButton: showCancelButton,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 100%; text-align: center;">
          <div id="lottie-container" style="width: 200px; height: 200px; margin: 0 auto;"></div>
          <p style="margin-top: 10px; word-wrap: break-word; max-width: 80%; padding: 0 10px;">${this.user ? `${this.user}, ` : ''}${text}</p>
        </div>`,
      didOpen: () => {
        this.loadLottieAnimation('lottie-container', image);
      },
      willOpen: () => {
        this.updateAlertStyles();
      }
    });
  }

  // Mostrar una alerta de éxito
  success(title: string, text: string, image: string = '/assets/animations/general/confetti.json') {
    this.createAlert(title, text, image);
  }

  // Mostrar una alerta de error
  formulario_invalido(title: string, text: string, image: string = '/assets/animations/general/formulario_invalido.json') {
    this.createAlert(title, text, image);
  }

  // Mostrar una alerta de advertencia
  alerta(title: string, text: string, image: string = '/assets/animations/general/alerta.json') {
    this.createAlert(title, text, image);
  }

  // Mostrar una alerta de confirmación (por ejemplo, para eliminar)
  confirmar_borrado(title: string, text: string, image: string = '/assets/animations/general/borrar_pregunta.json') {
    return this.createAlert(title, text, image, 'Sí, eliminemoslo', true);
  }

  confirmar_habilitado_deshabilitado(title: string, text: string, image: string = '/assets/animations/general/alerta.json', text_confirm: string) {
    return this.createAlert(title, text, image, text_confirm, true);
  }

  confirmar_restauracion(title: string, text: string, image: string = '/assets/animations/general/ojitos.json') {
    return this.createAlert(title, text, image, 'Sí, restauremoslo', true).then((result) => {
      this.restaurarSubject.next(result.isConfirmed);
    });
  }

  //Usar esto para caundo se pregunta por algo
  confirmar(title: string, text: string, image: string, text_confirmacion: string, showCancel: boolean, text_cancel:string){
    return this.createAlert(title, text, image, text_confirmacion, showCancel, text_cancel);
  }

  confirmar_estado_deshabilidato(title: string, text: string, image: string = '/assets/animations/configuration-methodPayment-comprobante/advertencia.json') {
    return this.createAlert(title, text, image, 'Sí, deshabilitemoslo', true).then((result) => {
      this.confirmationSubject.next(result.isConfirmed);
    });
  }

  //ir a Sunat
  go_sunat(title: string, text: string, image: string = '/assets/animations/configuration-methodPayment-comprobante/advertencia.json') {
    return this.createAlert(title, text, image, 'Consultar en SUNAT', true).then((result) => {
      this.confirmationSubject.next(result.isConfirmed);
    });
  }

  error(error:any, msg:any = ''){
    let gif:any = ''
    let message:any = ''

    switch(error){
      case 500: {
        message = 'Error interno del servidor. Intenta nuevamente más tarde.'
        gif = '/assets/animations/general/error_500.json'
        break;
      }

      case 404: {
        message = 'Pagina no encontrada';
        gif = '/assets/animations/general/error_404.json';  // Animación para error 404
        break;
      }
  
      case 403: {
        message = 'No tienes permisos suficientes para realizar esta acción.';
        gif = '/assets/animations/general/error_403.json';  // Animación para error 403
        break;
      }
  
      case 0: {
        message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        gif = '/assets/animations/general/error_de_conexion.json';  // Animación para error de conexión
        break;
      }
  
      case 400: {
        message = 'La solicitud no fue válida. Verifica los datos enviados.';
        gif = '/assets/animations/general/error_400.json';  // Animación para error 400 (Bad Request)
        break;
      }

      case 409: {
        message = 'La solicitud no fue válida. Verifica los datos enviados.';
        gif = '/assets/animations/general/error_400.json';  // Animación para error 400 (Bad Request)
        break;
      }

      case 422: {
        message = msg;
        gif = '/assets/animations/general/formulario_invalido.json';
        break;
      }
  
      default: {
        message = 'Hubo un error inesperado. Intenta nuevamente.';
        gif = '/assets/animations/general/error_default.json';  // Animación genérica para errores no especificados
        break;
      }
    } 

    Swal.fire({
      title: 'Opps!',
      confirmButtonText: 'Aceptar',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
        <div id="lottie-container" style="width: 200px; height: 200px; margin: auto;"></div>
        <p style="text-align: center; margin-top: 10px;">${this.user}, ${message}</p>
      </div>`,
      didOpen: () => {
        this.loadLottieAnimation('lottie-container', gif);
      },
      willOpen: () => {
        // Llamamos a la función auxiliar para actualizar los estilos
        this.updateAlertStyles();
      }
    });
  }
}

/* 
        Carga dinamica, solo caudno se necesita
        didOpen: () => {
        const lottieContainer = document.getElementById('lottie-container');
        if (lottieContainer) {
          // Importación dinámica de lottie-web
          import('lottie-web').then((lottie: any) => {  
            const animation = lottie.loadAnimation({
              container: lottieContainer,  
              path: '/assets/animations/general/formulario_invalido.json',  
              renderer: 'svg',  
              loop: true,  
              autoplay: true,  
            });
          }).catch(err => {
            console.error('Error al cargar la animación Lottie:', err);
          });
        }
      } */