import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    AppRoutingModule,
    FormsModule
  ]
})
export class SharedModule {}
