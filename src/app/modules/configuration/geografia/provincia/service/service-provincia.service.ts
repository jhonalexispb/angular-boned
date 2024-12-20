import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { ConfigDelay, URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProvinciaService {
  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    texto: BehaviorSubject<string>;
    
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
      public loadingService:LoadingService
    ) {}
  
    listProvincia(page = 1, search:string = ''){
      this.loadingService.showLoading('Listando provincias')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/provincias?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(()=>{
          setTimeout(() => {
            this.loadingService.hideLoading();
          }, ConfigDelay.LOADING_DELAY);
        })
      ) 
    }
  
    registerProvincia(data:any){
      this.loadingService.showLoading('Registrando provincia')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/provincias";
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    } 
  
    updateProvincia(ID_PROVINCIA:string,data:any){
      this.loadingService.showLoading('Actualizando provincia')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/provincias/"+ID_PROVINCIA;
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
  
    deleteProvincia(ID_PROVINCIA:string){
      this.loadingService.showLoading('Eliminando provincia')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/provincias/"+ID_PROVINCIA;
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
  
    restaurarProvincia(ID_PROVINCIA:string){
      this.loadingService.showLoading('Restaurando provincia')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/provincias/restaurar/"+ID_PROVINCIA;
      return this.http.put(URL,'',{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
}
