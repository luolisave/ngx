import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { StocksHomeComponent } from './components/stocks-home/stocks-home.component';
import { FundsHomeComponent } from './components/funds-home/funds-home.component';


export const routers: Routes = [
  { path: '', redirectTo: 'stocks', pathMatch: 'full'},
  { path: 'stocks', component: StocksHomeComponent },
  { path: 'funds', component: FundsHomeComponent }
  ];
@NgModule({
  declarations: [
    AppComponent,
    StocksHomeComponent,
    NavmenuComponent,
    FundsHomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot( routers )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
