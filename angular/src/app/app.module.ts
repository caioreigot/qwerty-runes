import { BaseUrlHttpInterceptor } from './core/interceptors/BaseUrlHttpInterceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RegistrationModule } from './features/registration/registration.module';
import { LoginModule } from './features/login/login.module';
import { GamesModule } from './features/games/games.module';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    LoginModule,
    RegistrationModule,
    GamesModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: BaseUrlHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
