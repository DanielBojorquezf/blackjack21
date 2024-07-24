import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlackjackComponent } from './blackjack/blackjack.component';

const routes: Routes = [
  { path: '', redirectTo: '/blackjack', pathMatch: 'full' },
  { path: 'blackjack', component: BlackjackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
