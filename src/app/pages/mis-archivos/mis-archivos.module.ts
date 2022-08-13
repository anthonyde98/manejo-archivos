import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisArchivosRoutingModule } from './mis-archivos-routing.module';
import { MisArchivosComponent } from './mis-archivos.component';
import { DndDirective } from './dnd.directive';


@NgModule({
  declarations: [
    MisArchivosComponent,
    DndDirective
  ],
  imports: [
    CommonModule,
    MisArchivosRoutingModule
  ]
})
export class MisArchivosModule { }
