import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from './service/loading-service.service';
import lottie from 'lottie-web';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, AfterViewChecked {
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  animation$: Observable<string>;
  animationPath: string = '';
  private animationSubscription: Subscription;
  private animationLoaded: boolean = false; 

  @ViewChild('lottieContainer', { static: false }) lottieContainer: ElementRef;

  constructor(
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.loadingService.isLoading$;
    this.texto$ = this.loadingService.texto$;
    this.animation$ = this.loadingService.animation$;
    
    this.animationSubscription = this.animation$.subscribe(animationPath => {
      if (animationPath) {
        this.animationPath = animationPath;
        this.animationLoaded = false;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    if (this.lottieContainer && this.animationPath && !this.animationLoaded) {
      this.loadLottieAnimation(this.lottieContainer.nativeElement, this.animationPath);
      this.animationLoaded = true;
    }
  }

  private loadLottieAnimation(container: HTMLElement, animationPath: string) {
    if (container) {
      lottie.loadAnimation({
        container: container,
        path: animationPath,    
        renderer: 'svg',       
        loop: true,             
        autoplay: true,         
      });
    }
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción para evitar fugas de memoria
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
  }
}