import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisArchivosComponent } from './mis-archivos.component';

const routes: Routes = [
  {
    path: '',
    component: MisArchivosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisArchivosRoutingModule { }
