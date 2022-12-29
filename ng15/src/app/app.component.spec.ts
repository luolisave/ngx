import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { StocksHomeComponent } from './components/stocks-home/stocks-home.component';
import { FundsHomeComponent } from './components/funds-home/funds-home.component';
import { BrowserModule } from '@angular/platform-browser';

export const routers: Routes = [
  { path: '', redirectTo: 'stocks', pathMatch: 'full'},
  { path: 'stocks', component: StocksHomeComponent },
  { path: 'funds', component: FundsHomeComponent }
  ];

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StocksHomeComponent,
        NavmenuComponent,
        FundsHomeComponent
      ],
      imports: [
        BrowserModule,
        RouterModule.forRoot( routers )
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng15'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng15');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('ng15 app is running!');
  });
});
