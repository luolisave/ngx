import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksHomeComponent } from './stocks-home.component';

describe('StocksHomeComponent', () => {
  let component: StocksHomeComponent;
  let fixture: ComponentFixture<StocksHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StocksHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
