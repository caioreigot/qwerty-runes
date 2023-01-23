import { NgModule } from '@angular/core';
import { RegistrationModule } from './features/registration/registration.module';
import { LoginModule } from './features/login/login.module';
import { BrowserModule } from '@angular/platform-browser';
import { SnackbarService } from './shared/services/snackbar.service';
import { UtilsService } from './shared/services/utils.service';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    LoginModule,
    RegistrationModule,
  ],
  providers: [
    UtilsService,
    SnackbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
