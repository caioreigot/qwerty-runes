import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UseInputValueOnEnterDirective } from './directives/use-input-value-on-enter.directive';

@NgModule({
  declarations: [
    UseInputValueOnEnterDirective
  ],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    UseInputValueOnEnterDirective
  ]
})
export class SharedModule {}
