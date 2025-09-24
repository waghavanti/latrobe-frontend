import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RestaurentDashComponent } from './restaurent-dash/restaurent-dash.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { FrontComponent } from './front/front.component';
import { GenloginComponent } from './genlogin/genlogin.component';
import { GensignupComponent } from './gensignup/gensignup.component';
import { FronttwoComponent } from './fronttwo/fronttwo.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecloginComponent } from './reclogin/reclogin.component';
import { RecsignupComponent } from './recsignup/recsignup.component';
import { RecpageComponent } from './recpage/recpage.component';
import { GenprofileComponent } from './genprofile/genprofile.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from './shared/api.service';
import { AuthService } from './shared/auth.service';
import { ResearchComponent } from './research/research.component';
import { AboutUaComponent } from './about-ua/about-ua.component';
import { RecprofileComponent } from './recprofile/recprofile.component';

import { FormsModule } from '@angular/forms';







@NgModule({
  declarations: [
    AppComponent,
    RestaurentDashComponent,
    FrontComponent,
    GenloginComponent,
    GensignupComponent,
    FronttwoComponent,
    RecloginComponent,
    RecsignupComponent,
    RecpageComponent,
    GenprofileComponent,
    ResearchComponent,
    AboutUaComponent,
    RecprofileComponent
   
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    FormsModule
    
  ],
  providers: [
    provideAnimationsAsync(),
    ApiService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
