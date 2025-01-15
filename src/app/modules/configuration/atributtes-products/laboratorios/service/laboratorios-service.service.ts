import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, catchError  } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class LaboratoriosServiceService {
  sweet:any = new SweetalertService
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  registerLaboratorio(data:any){
    this.loadingService.showLoading('Registrando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listLaboratorio(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando laboratorios')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
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
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteLaboratorio(ID_LABORATORIO:string){
    this.loadingService.showLoading('Eliminando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/"+ID_LABORATORIO;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  restaurarLaboratorio(ID_LABORATORIO:string){
    this.loadingService.showLoading('Restaurando laboratorio')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/restaurar/"+ID_LABORATORIO;
    return this.http.put(URL,'',{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //solicitamos los proveedores
  obtenerRecursos(){
    this.loadingService.showLoading('Solicitando recursos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/laboratorio/recursos/";
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
