import { LoadingService } from './../../../loadingScreen/loading-screen/service/loading-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, catchError } from 'rxjs';
import { ConfigDelay, URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class LugarEntregaService {
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService
  ) {}

  registerLugarEntrega(data:any){
    this.loadingService.showLoading('Registrando lugar de entrega')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listLugarEntrega(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando lugares de entrega')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  updateLugarEntrega(ID_LUGAR_ENTREGA:string,data:any){
    this.loadingService.showLoading('Actualizando lugar de entrega')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega/"+ID_LUGAR_ENTREGA;
    return this.http.put(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteLugarEntrega(ID_LUGAR_ENTREGA:string){
    this.loadingService.showLoading('Eliminando lugar de entrega')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/lugar_entrega/"+ID_LUGAR_ENTREGA;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
