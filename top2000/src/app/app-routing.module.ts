import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LinkInputComponent} from './components/link-input/link-input.component';


const routes: Routes = [
  { path: 'link', component: LinkInputComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
