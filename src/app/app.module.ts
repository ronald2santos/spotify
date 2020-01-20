import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'primeng/carousel';
import {OverlayPanelModule} from 'primeng/overlaypanel';



import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AudioFeaturesChartComponent } from './components/charts/audio-features-chart/audio-features-chart.component';
import { KeysComponent } from './components/charts/key-modes-chart/keys.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppInterceptorService } from './services/app-interceptor.service';
import { LoginComponent } from './components/login/login.component';
import { CurrentPlaybackComponent } from './components/current-playback/current-playback.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchBarComponent,
    NavBarComponent,
    routingComponents,
    AudioFeaturesChartComponent,
    KeysComponent,
    ProfileComponent,
    LoginComponent,
    CurrentPlaybackComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
    CarouselModule,
    OverlayPanelModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
