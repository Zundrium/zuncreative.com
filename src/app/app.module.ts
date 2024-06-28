import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProjectComponent } from './project/project.component';
import { FixedTitleComponent } from './fixed-title/fixed-title.component';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { WebThreedComponent } from './web-threed/web-threed.component';
import { WebArComponent } from './web-ar/web-ar.component';
import { ContactComponent } from './contact/contact.component';
import { IntroComponent } from './intro/intro.component';
import { MobileProjectComponent } from './mobile-project/mobile-project.component';
import { PlayInViewDirective } from './play-in-view.directive';
import { SlideContainerComponent } from './slide-container/slide-container.component';
import { SlideComponent } from './slide/slide.component';
import { BabylonIntroBackgroundComponent } from './babylon-intro-background/babylon-intro-background.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    FixedTitleComponent,
    TopNavigationComponent,
    NotFoundComponent,
    WebThreedComponent,
    WebArComponent,
    ContactComponent,
    IntroComponent,
    MobileProjectComponent,
    PlayInViewDirective,
    SlideContainerComponent,
    SlideComponent,
    BabylonIntroBackgroundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
