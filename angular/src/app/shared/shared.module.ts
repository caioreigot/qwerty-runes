import { SnackbarService } from './services/snackbar.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
  ]
})
export class SharedModule {}
