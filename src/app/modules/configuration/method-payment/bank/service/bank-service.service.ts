import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { ConfigDelay, URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  texto: BehaviorSubject<string>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    public loadingService:LoadingService
  ) {}

  listBancos(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando bancos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/banco?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  registerBanco(data:any){
    this.loadingService.showLoading('Registrando banco')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/banco";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  updateBanco(ID_BANCO:string,data:any){
    this.loadingService.showLoading('Actualizando banco')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/banco/"+ID_BANCO;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteBanco(ID_BANCO:string){
    this.loadingService.showLoading('Eliminando banco')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/banco/"+ID_BANCO;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
