import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestRoutingModule } from './test-routing.module';
import { AbcComponent } from './abc/abc.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [AbcComponent, CreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestRoutingModule
  ]
})
export class TestModule { }
