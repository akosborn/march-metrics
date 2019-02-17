import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {TeamComponent} from './team/team.component';
import {CompareComponent} from './compare/compare.component';
import {HomeComponent} from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team', component: TeamComponent },
  { path: 'compare', component: CompareComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
