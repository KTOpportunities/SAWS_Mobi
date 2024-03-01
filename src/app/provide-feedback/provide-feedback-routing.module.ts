import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvideFeedbackPage } from './provide-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: ProvideFeedbackPage,
  },
  {
    path: 'message-list',
    loadChildren: () =>
      import('./message-list/message-list.module').then(
        (m) => m.MessageListPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProvideFeedbackPageRoutingModule {}
