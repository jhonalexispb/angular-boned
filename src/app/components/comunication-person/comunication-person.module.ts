import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunicationPersonComponent } from './comunication-person.component';



@NgModule({
  declarations: [ComunicationPersonComponent],
  imports: [
    CommonModule
  ],
    exports: [ComunicationPersonComponent]
})
export class ComunicationPersonModule { }
