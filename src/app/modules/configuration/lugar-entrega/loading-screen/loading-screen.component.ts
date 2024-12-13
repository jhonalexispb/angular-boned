
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LugarEntregaService } from '../service/lugar-entrega.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit { 
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  constructor(
    private lugarEntregaService: LugarEntregaService
  ) {}


  ngOnInit(): void {
    this.isLoading$ = this.lugarEntregaService.isLoading$;
    this.texto$ = this.lugarEntregaService.texto.asObservable();
  }
}
