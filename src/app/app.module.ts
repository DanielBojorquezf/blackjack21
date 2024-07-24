import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { HideDealerCardsDirective } from './directives/hide-dealer-cards.directive';

@NgModule({
  declarations: [
    AppComponent,
    BlackjackComponent,
    HideDealerCardsDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
