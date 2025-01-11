import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { BehaviorSubject, throwError  } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class HandleErrorService {

    private router: Router
  sweet:any = new SweetalertService

  private restauracionSubject = new BehaviorSubject<boolean>(false);
  public restauracion$ = this.restauracionSubject.asObservable();

    constructor(
        private modalService: NgbModal,
        public authservice: AuthService,
        private loadingService:LoadingService,
      ) {}
    handleError(error: any) {
        // Manejar el error 401 (No autorizado
        if (error.status === 401) {
        this.modalService.dismissAll();
        this.loadingService.hideLoading();
        this.authservice.logout();
        this.router.navigate(['/login']);
        } else if (error.status === 403) {
        this.modalService.dismissAll(); 
        this.sweet.alerta('Acceso denegado', 'No tienes permiso para realizar esta acción');
        } else if (error.status === 422) {
        if(error.error.message){
            if(error.error.message == 409){
            this.sweet.confirmar_restauracion('Atencion',error.error.message_text);
            this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
                this.restauracionSubject.next(confirmed); 
            })
            } else if (error.error.message == 403) {
            this.sweet.alerta('Ups', error.error.message_text);
            } else{
            this.sweet.error(error.error.message,error.error.message_text);
            }
        }else{
            const errorMessages = error.error.errors;
            const formattedErrors: { field: string, message: string }[] = [];

            // Formatear los errores para enviarlos como parámetros
            for (let field in errorMessages) {
            errorMessages[field].forEach((message: string) => {
                formattedErrors.push({ field: field, message: message });
            });
            }
            this.sweet.errorBackend(error.status,'Por favor, corrige los siguientes errores de validación:' ,formattedErrors);
        }
        }

        return throwError(() => error); // Rethrow el error
    }
}