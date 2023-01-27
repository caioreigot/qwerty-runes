import { GeneralKnowledgeComponent } from './features/games/general-knowledge/general-knowledge.component';
import { LobbyComponent } from './features/games/lobby/lobby.component';
import { GamesGuard } from './core/guards/games.guard';
import { GamesComponent } from './features/games/games.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { LoginComponent } from './features/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'games',
    component: GamesComponent,
    canActivate: [GamesGuard],
    children: [
      {
        path: '',
        component: LobbyComponent
      },
      {
        path: 'general-knowledge',
        component: GeneralKnowledgeComponent
      }
    ]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'games'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
