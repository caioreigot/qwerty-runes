import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdministratorsComponent } from './administrators/administrators.component';
import { AdminGeneralKnowledgeComponent } from './admin-general-knowledge/admin-general-knowledge.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdministratorsComponent,
    AdminGeneralKnowledgeComponent,
  ],
  imports: [
    SharedModule,
    CommonModule
  ]
})
export class AdminModule {}
