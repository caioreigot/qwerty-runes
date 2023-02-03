import { BaseUrlHttpInterceptor } from './core/interceptors/BaseUrlHttpInterceptor';
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
import { AdminComponent } from './features/admin/admin.component';

const backendUrl = isDevMode() ? 'http://localhost:3000' : document.location.host;
const socketConfig: SocketIoConfig = { url: backendUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(socketConfig),
    CoreModule,
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
