import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceDistritoService {
      isLoadingSubject: BehaviorSubject<boolean>;
      texto: BehaviorSubject<string>;
      
      constructor(
        private http: HttpClient,
        public authservice: AuthService,
        public loadingService:LoadingService
      ) {}
    
      listDistrito(page = 1, search:string = ''){
        this.loadingService.showLoading('Listando distritos')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/distritos?page="+page+"&search="+search;
        return this.http.get(URL,{headers: headers}).pipe(
          finalize(()=>{
            setTimeout(() => {
              this.loadingService.hideLoading();
            }, ConfigDelay.LOADING_DELAY);
          })
        ) 
      }
    
      registerDistrito(data:any){
        this.loadingService.showLoading('Registrando distrito')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/distritos";
        return this.http.post(URL,data,{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      } 
    
      updateDistrito(ID_DISTRITO:string,data:any){
        this.loadingService.showLoading('Actualizando distrito')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/distritos/"+ID_DISTRITO;
        return this.http.post(URL,data,{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
    
      deleteDistrito(ID_DISTRITO:string){
        this.loadingService.showLoading('Eliminando distrito')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/distritos/"+ID_DISTRITO;
        return this.http.delete(URL,{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
    
      restaurarDistrito(ID_DISTRITO:string){
        this.loadingService.showLoading('Restaurando distrito')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/distritos/restaurar/"+ID_DISTRITO;
        return this.http.put(URL,'',{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
}
