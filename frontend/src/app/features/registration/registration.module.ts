import { RegistrationComponent } from './registration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    RegistrationComponent
  ],
  imports: [SharedModule]
})
export class RegistrationModule {}
