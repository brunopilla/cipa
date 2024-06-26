import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EleicaoCipaComponent } from './eleicao-cipa/eleicao-cipa.component';
import { CalendarioComponent } from './calendario/calendario.component';

const routes: Routes = [
  { path: 'home', component: EleicaoCipaComponent },
  { path: '', redirectTo: 'calendario', pathMatch: 'full' },
  { path: 'calendario', component: CalendarioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
