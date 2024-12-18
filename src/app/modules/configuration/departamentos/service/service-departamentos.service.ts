import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceDepartamentosService {
  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    texto: BehaviorSubject<string>;
    
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
      private loadingService:LoadingService
    ) {}
  
    registerDepartamento(data:any){
      this.loadingService.showLoading('Registrando departamento')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/departamentos";
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
  
    listDepartamentos(page = 1, search:string = ''){
      this.loadingService.showLoading('Listando departamentos')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/departamentos?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(()=>{
          setTimeout(() => {
            this.loadingService.hideLoading();
          }, 1000);
        })
      ) 
    }
  
    updateDepartamento(ID_DEPARTAMENTO:string,data:any){
      this.loadingService.showLoading('Actualizando departamento')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/departamentos/"+ID_DEPARTAMENTO;
      return this.http.post(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
  
    deleteDepartamento(ID_DEPARTAMENTO:string){
      this.loadingService.showLoading('Eliminando departamento')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/departamentos/"+ID_DEPARTAMENTO;
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
}
