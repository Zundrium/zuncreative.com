import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { IntroComponent } from './intro/intro.component';
import { WebArComponent } from './web-ar/web-ar.component';
import { WebThreedComponent } from './web-threed/web-threed.component';

const routes: Routes = [
  { path: 'intro', component: IntroComponent },
  { path: 'web-3d', component: WebThreedComponent },
  { path: 'web-ar', component: WebArComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: "intro", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
