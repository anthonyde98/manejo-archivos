import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: "mis-archivos",
    pathMatch: 'full'
  },
  {
    path: "mis-archivos",
    loadChildren: () => import('./pages/mis-archivos/mis-archivos.module').then(m => m.MisArchivosModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
