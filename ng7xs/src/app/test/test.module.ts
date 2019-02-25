import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { AbcComponent } from './abc/abc.component';

@NgModule({
  declarations: [AbcComponent],
  imports: [
    CommonModule,
    TestRoutingModule
  ]
})
export class TestModule { }
