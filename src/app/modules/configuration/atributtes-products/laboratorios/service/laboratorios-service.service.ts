import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, finalize, catchError, throwError  } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class LaboratoriosServiceService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  texto: BehaviorSubject<string>;

  private router: Router
  sweet:any = new SweetalertService
  
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  registerLaboratorio(data:any){
    this.loadingService.showLoading('Registrando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio";
    return this.http.post(URL,data,{headers: headers}).pipe(
      /* catchError((error) => this.handleErrorService.handleError(error)), */
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listLaboratorio(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando laboratorios')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio?page="+page+"&search="+search;
    console.log(headers)
    console.log(this.authservice.token)
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  updateLaboratorio(ID_LABORATORIO:string,data:any){
    this.loadingService.showLoading('Actualizando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/"+ID_LABORATORIO;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteLaboratorio(ID_LABORATORIO:string){
    this.loadingService.showLoading('Eliminando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/"+ID_LABORATORIO;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  restaurarLaboratorio(ID_LABORATORIO:string){
    this.loadingService.showLoading('Restaurando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/restaurar/"+ID_LABORATORIO;
    return this.http.put(URL,'',{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  /* private handleError(error: any) {
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
            if (confirmed) {
              this.restaurarLaboratorio(error.error.laboratorio).subscribe({
                next: (response) => {
                  // Aquí puedes manejar lo que ocurre después de que el laboratorio se restaure con éxito
                  console.log('Restauración exitosa:', response);
                  this.modalService.dismissAll();
                  this.sweet.success('¡Restaurado!', response.message_text, '/assets/animations/general/restored.json');
                },
                error: (err) => {
                  // Manejo de errores si la restauración falla
                  console.error('Error al restaurar laboratorio:', err);
                }
              });
            }
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
  } */
}
