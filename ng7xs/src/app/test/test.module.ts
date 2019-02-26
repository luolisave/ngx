import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { AbcComponent } from './abc/abc.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [AbcComponent, CreateComponent],
  imports: [
    CommonModule,
    TestRoutingModule
  ]
})
export class TestModule { }
