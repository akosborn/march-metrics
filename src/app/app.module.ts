import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopNavComponent } from './top-nav/top-nav.component';
import {HttpClientModule} from '@angular/common/http';
import { TeamComponent } from './team/team.component';
import { CompareComponent } from './compare/compare.component';
import {AppRoutingModule} from './app-routing.module';
import {ChartsModule} from 'ng4-charts';
import { HomeComponent } from './home/home.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    TeamComponent,
    CompareComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    NgbModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
