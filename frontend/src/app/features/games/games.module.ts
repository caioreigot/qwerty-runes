import { CoreModule } from './../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { GamesComponent } from './games.component';
import { LobbyComponent } from './lobby/lobby.component';
import { GeneralKnowledgeComponent } from './general-knowledge/general-knowledge.component';
import { AddGeneralKnowledgeComponent } from './add-general-knowledge/add-general-knowledge.component';

@NgModule({
  declarations: [
    GamesComponent,
    LobbyComponent,
    GeneralKnowledgeComponent,
    AddGeneralKnowledgeComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
  ],
})
export class GamesModule {}
