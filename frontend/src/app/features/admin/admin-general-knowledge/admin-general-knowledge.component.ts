import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../shared/services/backend.service';

@Component({
  selector: 'app-admin-general-knowledge',
  templateUrl: './admin-general-knowledge.component.html',
  styleUrls: ['./admin-general-knowledge.component.less']
})
export class AdminGeneralKnowledgeComponent implements OnInit {

  constructor(private backendService: BackendService) {}

  ngOnInit() {
    this.backendService.getGeneralKnowledgeUnapprovedQuestion()
      .subscribe((question: any) => {
        if (!question) {
          // TODO: Não há nada para aprovar
          return;
        }

        // TODO
      });
  }
}
