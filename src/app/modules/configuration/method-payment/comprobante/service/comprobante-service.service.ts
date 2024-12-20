import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { ConfigDelay, URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    texto: BehaviorSubject<string>;
    
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
      public loadingService:LoadingService
    ) {}
  
    listComprobante(page = 1, search:string = ''){
      this.loadingService.showLoading('Listando comprobantes')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/comprobante?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(()=>{
          setTimeout(() => {
            this.loadingService.hideLoading();
          }, ConfigDelay.LOADING_DELAY);
        })
      ) 
    }
  
    registerComprobante(data:any){
      this.loadingService.showLoading('Registrando comprobante')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/comprobante";
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
  
    updateComprobante(ID_COMPROBANTE:string,data:any){
      this.loadingService.showLoading('Actualizando comprobante')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/comprobante/"+ID_COMPROBANTE;
      return this.http.put(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
  
    deleteComprobante(ID_COMPROBANTE:string){
      this.loadingService.showLoading('Eliminando comprobante')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/comprobante/"+ID_COMPROBANTE;
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
}
