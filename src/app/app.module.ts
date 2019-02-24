import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {NgbDateAdapter, NgbDateNativeAdapter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TopNavComponent } from './top-nav/top-nav.component';
import {HttpClientModule} from '@angular/common/http';
import { TeamComponent } from './team/team.component';
import { CompareComponent } from './compare/compare.component';
import {AppRoutingModule} from './app-routing.module';
import {ChartsModule} from 'ng4-charts';
import { HomeComponent } from './home/home.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {OrderModule} from 'ngx-order-pipe';
import { InverseSignPipe } from './inversesign.pipe';
import { SignPrependPipe } from './signprepend.pipe';
import {FormsModule} from '@angular/forms';
import {DateFormatPipe, MomentModule} from 'ngx-moment';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    TeamComponent,
    CompareComponent,
    HomeComponent,
    InverseSignPipe,
    SignPrependPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    NgbModule,
    NgxPaginationModule,
    OrderModule
  ],
  providers: [DateFormatPipe,  { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule { }
