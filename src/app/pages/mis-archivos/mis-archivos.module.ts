import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisArchivosRoutingModule } from './mis-archivos-routing.module';
import { MisArchivosComponent } from './mis-archivos.component';
import { DndDirective } from './dnd.directive';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-css';

@NgModule({
  declarations: [
    MisArchivosComponent,
    DndDirective
  ],
  imports: [
    CommonModule,
    MisArchivosRoutingModule,
    NgxDocViewerModule
  ],
})
export class MisArchivosModule { }
