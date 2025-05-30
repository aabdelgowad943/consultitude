import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { SuccessfullySubscribedComponent } from './pages/successfully-subscribed/successfully-subscribed.component';
import { HomeComponent } from './pages/home/home.component';
import { TermsAndConditionComponent } from './pages/terms-and-condition/terms-and-condition.component';
import { PrivacyAndPolicyComponent } from './pages/privacy-and-policy/privacy-and-policy.component';
import { CookiesPolicyComponent } from './pages/cookies-policy/cookies-policy.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { IndexComponent } from './pages/index/index.component';
import { AlreadySubscribedComponent } from './pages/already-subscribed/already-subscribed.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { NewLandingPageComponent } from './pages/new-landing-page/new-landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      // {
      //   path: 'home',
      //   component: HomeComponent,
      // },
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'successfully_subscribed',
    component: SuccessfullySubscribedComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionComponent,
  },
  {
    path: 'privacy-and-policy',
    component: PrivacyAndPolicyComponent,
  },
  {
    path: 'cookie-policy',
    component: CookiesPolicyComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'index',
    component: NewLandingPageComponent,
  },
  {
    path: 'subscribed',
    component: AlreadySubscribedComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
