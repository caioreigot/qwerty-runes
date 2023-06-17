import { BaseUrlHttpInterceptor } from './core/interceptors/base-url-http-interceptor';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RegistrationModule } from './features/registration/registration.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { GamesModule } from './features/games/games.module';
import { LoginModule } from './features/login/login.module';
import { AdminModule } from './features/admin/admin.module';

const backendUrl = isDevMode() ? 'http://localhost:3000' : document.location.host;
const socketConfig: SocketIoConfig = { url: backendUrl, options: {} };

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    LoginModule,
    RegistrationModule,
    GamesModule,
    AdminModule,
    SocketIoModule.forRoot(socketConfig),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: BaseUrlHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
