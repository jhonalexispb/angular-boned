import { LoadingService } from './../../../../loadingScreen/loading-screen/service/loading-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, catchError } from 'rxjs';
import { ConfigDelay, URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class MethodService {
    
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
      public loadingService:LoadingService,
      public handleErrorService: HandleErrorService
    ) {}
  
    listMetodos(page = 1, search:string = ''){
      this.loadingService.showLoading('Listando métodos de pago')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/metodo_pago?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        catchError((error) => this.handleErrorService.handleError(error)),
        finalize(()=>{
          setTimeout(() => {
            this.loadingService.hideLoading();
          }, ConfigDelay.LOADING_DELAY);
        })
      ) 
    }
  
    updateMetodo(ID_METODO:string,data:any){
      this.loadingService.showLoading('Actualizando método de pago')
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/metodo_pago/"+ID_METODO;
      return this.http.put(URL,data,{headers: headers}).pipe(
        catchError((error) => this.handleErrorService.handleError(error)),
        finalize(()=>this.loadingService.hideLoading())
      )
    }
}
