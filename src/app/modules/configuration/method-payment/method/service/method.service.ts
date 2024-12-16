import { LoadingService } from './../../../../loadingScreen/loading-screen/service/loading-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class MethodService {
  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    texto: BehaviorSubject<string>;
    
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
      public loadingService:LoadingService
    ) {}
  
    listMetodos(page = 1, search:string = ''){
      this.loadingService.showLoading('Listando métodos de pago')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/metodo_pago?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(()=>{
          setTimeout(() => {
            this.loadingService.hideLoading();
          }, 1000);
        })
      ) 
    }
  
    updateMetodo(ID_METODO:string,data:any){
      this.loadingService.showLoading('Actualizando método de pago')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/metodo_pago/"+ID_METODO;
      return this.http.put(URL,data,{headers: headers}).pipe(
        finalize(()=>this.loadingService.hideLoading())
      )
    }
}
