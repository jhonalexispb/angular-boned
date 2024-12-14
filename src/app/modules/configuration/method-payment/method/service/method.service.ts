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
    ) {
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);
      this.isLoading$ = this.isLoadingSubject.asObservable();
      this.texto = new BehaviorSubject<string>('');
    }
  
    listMetodos(page = 1, search:string = ''){
      this.texto.next('Listando métodos de pago')
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/metodo_pago?page="+page+"&search="+search;
      return this.http.get(URL,{headers: headers}).pipe(
        finalize(()=>this.isLoadingSubject.next(false))
      ) 
    }
  
    updateMetodo(ID_METODO:string,data:any){
      this.texto.next('Actualizando método de pago')
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
      let URL = URL_SERVICIO+"/metodo_pago/"+ID_METODO;
      return this.http.put(URL,data,{headers: headers}).pipe(
        finalize(()=>this.isLoadingSubject.next(false))
      )
    }
}
