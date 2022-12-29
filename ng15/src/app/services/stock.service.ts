import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Stock {
  _id: string;
  name: string;
  price: number;
}

export const STOCKS = [
  {
    _id: 'FNMA',
    name: 'Fani Mac',
    price: 11.23
  },
  {
    _id: 'AMD',
    name: 'AMD device',
    price: 99.00
  }
]

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor() { }

  getStocks(): Observable<Stock[]> {
    const stocks = of(STOCKS);
    return stocks;
  }
}
