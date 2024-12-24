import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteProveedorService {
  isLoading$: Observable<boolean>;
      isLoadingSubject: BehaviorSubject<boolean>;
      texto: BehaviorSubject<string>;
      
      constructor(
        private http: HttpClient,
        public authservice: AuthService,
        private loadingService:LoadingService
      ) {}
    
      registerRepresentanteProveedor(data:any){
        this.loadingService.showLoading('Registrando representante')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/representante_proveedor";
        return this.http.post(URL,data,{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
    
      listRepresentanteProveedor(page = 1, search:string = ''){
        this.loadingService.showLoading('Listando representantes')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/representante_proveedor?page="+page+"&search="+search;
        return this.http.get(URL,{headers: headers}).pipe(
          finalize(()=>{
            setTimeout(() => {
              this.loadingService.hideLoading();
            }, ConfigDelay.LOADING_DELAY);
          })
        ) 
      }
    
      updateRepresentanteProveedor(ID_REPRESENTANTE:string,data:any){
        this.loadingService.showLoading('Actualizando representante')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/representante_proveedor/"+ID_REPRESENTANTE;
        return this.http.put(URL,data,{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
    
      deleteRepresentanteProveedor(ID_REPRESENTANTE:string){
        this.loadingService.showLoading('Eliminando representante')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/representante_proveedor/"+ID_REPRESENTANTE;
        return this.http.delete(URL,{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
  
      restaurarRepresentanteProveedor(ID_REPRESENTANTE:string){
        this.loadingService.showLoading('Restaurando representante')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/representante_proveedor/restaurar/"+ID_REPRESENTANTE;
        return this.http.put(URL,'',{headers: headers}).pipe(
          finalize(()=>this.loadingService.hideLoading())
        )
      }
}
