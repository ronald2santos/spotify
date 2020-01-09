import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { TopTracksComponent } from './components/top-tracks/top-tracks.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, data: {animation: 'Profile'} },
  { path: 'overview', component: OverviewComponent,data: {animation: 'Overview'} },
  { path: 'topTracks', component: TopTracksComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, ProfileComponent, OverviewComponent, TopTracksComponent];
