import { AdminGuard } from './core/guards/admin.guard';
import { AdminComponent } from './features/admin/admin.component';
import { GeneralKnowledgeComponent } from './features/games/general-knowledge/general-knowledge.component';
import { LobbyComponent } from './features/games/lobby/lobby.component';
import { GamesGuard } from './core/guards/games.guard';
import { GamesComponent } from './features/games/games.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { AddGeneralKnowledgeComponent } from './features/games/add-general-knowledge/add-general-knowledge.component';
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
    path: 'add-general-knowledge',
    component: AddGeneralKnowledgeComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
