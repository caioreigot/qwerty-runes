import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { GamesComponent } from './games.component';

@NgModule({
  declarations: [
    GamesComponent
  ],
  imports: [
    SharedModule
  ],
})
export class GamesModule {}
