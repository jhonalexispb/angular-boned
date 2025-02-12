import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, throwError } from 'rxjs';
import { AuthService } from '../auth';
import { LoadingService } from '../loadingScreen/loading-screen/service/loading-service.service';
import { SweetalertService } from './sweetAlert.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {
    private router: Router
    sweet:any = new SweetalertService
   
    private restaurarSubject = new Subject<string>();
    
    constructor(
        private modalService: NgbModal,
        public authservice: AuthService,
        private loadingService:LoadingService
      ) {}

    handleError(error: any) {
        switch (error.status) {
            case 0:
              this.modalService.dismissAll();
              this.loadingService.hideLoading();
              this.sweet.alerta('Ups', 'El servidor no responde, por favor intenta más tarde.','/assets/animations/general/error_default.json');
              break;

            case 401:
              this.modalService.dismissAll();
              this.loadingService.hideLoading();
              this.authservice.logout();
              this.router.navigate(['/login']);
              break;
            
            case 403:
              this.modalService.dismissAll(); 
              this.sweet.alerta('Acceso denegado', 'No tienes permiso para realizar esta acción');
              break;
          
            case 422:
              if (error.error.message == 403) {
                if(error.error.go_sunat){
                  this.sweet.go_sunat('Ups', error.error.message_text);
                  const ruc = error.error.ruc_search;
                  this.sweet.getConfirmationObservable().subscribe((confirmed:boolean) => {
                    if (confirmed) {
                      navigator.clipboard.writeText(ruc).then(() => {
                        window.open('https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp', '_blank');
                      })
                    }
                  });
                }else{
                  this.sweet.alerta('Ups', error.error.message_text);
                }
              } else {
                const errorMessages = error.error; // Aquí accedemos directamente a `error.error`
                const formattedErrors: { field: string, message: string }[] = [];

                // Verificar si el mensaje de error está presente
                if (errorMessages && errorMessages.error) {
                  // Si es un error con un solo mensaje
                  formattedErrors.push({ field: 'general', message: errorMessages.error });
                }

                // Crear una cadena de texto con los errores formateados
                const errorText = formattedErrors
                  .map(error => `${error.message}`)
                  .join(', '); // Unir todos los errores en una sola cadena separada por comas

                // Mostrar el mensaje de los errores
                this.sweet.formulario_invalido('Opps!', `Por favor, corrige los siguientes errores de validación: ${errorText}`);
              }
              break;
          
            default:
                this.modalService.dismissAll();
                this.loadingService.hideLoading();
                this.sweet.alerta('Ups', 'Error interno del servidor. Intenta nuevamente más tarde.','/assets/animations/general/error_400.json');
              break;
        }

        return throwError(() => error); // Rethrow el error
    }

    getRestauracionObservable() {
        return this.restaurarSubject.asObservable();
    }
}
