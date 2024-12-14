import { MethodService } from './../service/method.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit { 
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  constructor(
    private methodService: MethodService
  ) {}


  ngOnInit(): void {
    this.isLoading$ = this.methodService.isLoading$;
    this.texto$ = this.methodService.texto.asObservable();
  }
}
