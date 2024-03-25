import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
  },
  {
    path: 'subscription-package/:id', // Define the route with the ID parameter
    loadChildren: () =>
      import('./subscription-package/subscription-package.module').then(
        (m) => m.SubscriptionPackagePageModule
      ),
  },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'folder',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'login/:id', // Define the route with the ID parameter
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./auth/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'forecast',
    loadChildren: () =>
      import('./forecast/forecast.module').then((m) => m.ForecastPageModule),
  },

  {
    path: 'aviation-home',
    loadChildren: () =>
      import('./aviation-home/aviation-home.module').then(
        (m) => m.AviationHomePageModule
      ),
  },
  {
    path: 'color-coded',
    loadChildren: () =>
      import('./color-coded/color-coded.module').then(
        (m) => m.ColorCodedPageModule
      ),
  },
  {
    path: 'aviation-code',
    loadChildren: () =>
      import('./aviation-code/aviation-code.module').then(
        (m) => m.AviationCodePageModule
      ),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./news/news.module').then((m) => m.NewsPageModule),
  },
  {
    path: 'subscription-package',
    loadChildren: () =>
      import('./subscription-package/subscription-package.module').then(
        (m) => m.SubscriptionPackagePageModule
      ),
  },
  {
    path: 'provide-feedback',
    loadChildren: () =>
      import('./provide-feedback/provide-feedback.module').then(
        (m) => m.ProvideFeedbackPageModule
      ),
  },
  {
    path: 'international',
    loadChildren: () =>
      import('./international/international.module').then(
        (m) => m.InternationalPageModule
      ),
  },
  {
    path: 'flight-briefing',
    loadChildren: () =>
      import('./flight-briefing/flight-briefing.module').then(
        (m) => m.FlightBriefingPageModule
      ),
  },
  {
    path: 'observation',
    loadChildren: () =>
      import('./observation/observation.module').then(
        (m) => m.ObservationPageModule
      ),
  },
  {
    path: 'domestic',
    loadChildren: () =>
      import('./domestic/domestic.module').then((m) => m.DomesticPageModule),
  },
  {
    path: 'aero-sport',
    loadChildren: () =>
      import('./aero-sport/aero-sport.module').then(
        (m) => m.AeroSportPageModule
      ),
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'message-list',
    loadChildren: () =>
      import('../app/provide-feedback/message-list/message-list.module').then(
        (m) => m.MessageListPageModule
      ),
  },
  {
    path: 'observation-metar-history',
    loadChildren: () =>
      import(
        './observation-metar-history/observation-metar-history.module'
      ).then((m) => m.ObservationMetarHistoryPageModule),
  },
  {
    path: 'web-cam',
    loadChildren: () =>
      import('./web-cam/web-cam.module').then((m) => m.WebCamPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
