import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RestaurentDashComponent } from './restaurent-dash/restaurent-dash.component';

import { FrontComponent } from './front/front.component';
import { GenloginComponent } from './genlogin/genlogin.component';
import { GensignupComponent } from './gensignup/gensignup.component';
import { FronttwoComponent } from './fronttwo/fronttwo.component';
import { RecpageComponent } from './recpage/recpage.component';
import { RecloginComponent } from './reclogin/reclogin.component';
import { RecsignupComponent } from './recsignup/recsignup.component';
import { GenprofileComponent } from './genprofile/genprofile.component';
import { ResearchComponent } from './research/research.component';
import { AboutUaComponent } from './about-ua/about-ua.component';
import { RecprofileComponent } from './recprofile/recprofile.component';

const routes: Routes = [
  {
    path: '', component: FrontComponent
  }, 

  {
    path: 'front', component: FrontComponent
  }, 
 {
   path:'restaurent' , component: RestaurentDashComponent
 },
 {
  path:'genlogin' , component: GenloginComponent
},
{
  path:'gensignup' , component: GensignupComponent
},
{
  path:'reclogin' , component: RecloginComponent
},
{
  path:'recsignup' , component: RecsignupComponent
},

{
  path: 'fronttwo', component: FronttwoComponent
},
{
  path: 'recpage', component: RecpageComponent
},
{
  path: 'genprofile', component: GenprofileComponent
},
{
  path: 'research', component: ResearchComponent
},
{
  path: 'about_ua', component: AboutUaComponent
},
{
  path: 'recprofile', component: RecprofileComponent
}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
