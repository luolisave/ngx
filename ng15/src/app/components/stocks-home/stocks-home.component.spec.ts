import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksHomeComponent } from './stocks-home.component';

import { RunHelpers, TestScheduler  } from 'rxjs/testing';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

describe('StocksHomeComponent', () => {
  let component: StocksHomeComponent;
  let fixture: ComponentFixture<StocksHomeComponent>;

  let scheduler: TestScheduler; // rxjs test

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StocksHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // rxjs test
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should: service get stocks', () => {
    component.getStocks();
    fixture.detectChanges();
    component.stocks$.subscribe(aaa=>{
      expect(aaa).toEqual([{
        _id: 'FNMA',
        name: 'Fani Mac',
        price: 11.23
      },
      {
        _id: 'AMD',
        name: 'AMD device',
        price: 99.00
      }]);
    })
  });

  it('should assert two obs with the RxJS testing utils (RunHelpers.cold())', () => {
    scheduler.run(({cold, expectObservable}) => { // (helpers: RunHelpers) => {
      const sourceValues = {a: 1, b: 2, c: 3};
      const source$ = cold('a-b--c-|', sourceValues);

      const expectedValues = {a: 10, b: 20, c: 30};
      const expected$ = cold('a-b--c-|', expectedValues);

      const result$ = source$.pipe(map(v => (v * 10)));
      expectObservable(result$).toEqual(expected$);
    });
  });

});

