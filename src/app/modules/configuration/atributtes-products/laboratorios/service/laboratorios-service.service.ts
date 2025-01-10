import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, finalize, catchError, throwError  } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private loadingService:LoadingService
  ) {}

  registerLaboratorio(data:any){
    this.loadingService.showLoading('Registrando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError(this.handleError.bind(this)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listLaboratorio(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando laboratorios')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError(this.handleError.bind(this)),
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
      catchError(this.handleError.bind(this)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteLaboratorio(ID_LABORATORIO:string){
    this.loadingService.showLoading('Eliminando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/"+ID_LABORATORIO;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError(this.handleError.bind(this)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  restaurarLaboratorio(ID_LABORATORIO:string){
    this.loadingService.showLoading('Restaurando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/restaurar/"+ID_LABORATORIO;
    return this.http.put(URL,'',{headers: headers}).pipe(
      catchError(this.handleError.bind(this)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  private handleError(error: any) {
    // Manejar el error 401 (No autorizado)
    if (error.status === 401) {
      this.modalService.dismissAll();
      this.loadingService.hideLoading();
      this.authservice.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      this.modalService.dismissAll(); 
      this.sweet.alerta('Acceso denegado', 'No tienes permiso para realizar esta acción');
    } else {
      this.sweet.error(error.status); // Mostrar error con SweetAlert
    }

    return throwError(() => error); // Rethrow el error
  }
}
