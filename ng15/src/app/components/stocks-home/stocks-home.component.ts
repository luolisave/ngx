import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Stock, StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stocks-home',
  templateUrl: './stocks-home.component.html',
  styleUrls: ['./stocks-home.component.css']
})
export class StocksHomeComponent {
  stocks$: Observable<Stock[]> = of([]);
  constructor(private stockService: StockService) {

  }
  getStocks() {
    this.stocks$ = this.stockService.getStocks();
  }
}
