import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { BackendService } from '../../../shared/services/backend.service';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.less']
})
export class AdministratorsComponent implements OnInit {
  
  private _adminNicknames: BehaviorSubject<string[]> = new BehaviorSubject(new Array<string>());
  adminNicknames: Observable<string[]> = this._adminNicknames.asObservable();
  
  constructor(
    private backendService: BackendService,
    private snackbarService: SnackbarService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.backendService.getAllAdminNicknames().subscribe((admins) => {
      this._adminNicknames.next(admins);
    });
  }

  addAdmin(nickname: string) {
    this.backendService.addAdmin(nickname).subscribe({
      error: (response) => this.utilsService.handleResponseErrorAndShowInSnackbar(response),
      next: (response) => {
        this.snackbarService.showMessage('Administrador adicionado.');
        const newAdminNicknames = this._adminNicknames.value;
        newAdminNicknames.push(response.nickname)
        this._adminNicknames.next(newAdminNicknames);
      }
    });
  }

  removeAdmin(nickname: string) {
    this.backendService.removeAdmin(nickname).subscribe({
      error: (response) => this.utilsService.handleResponseErrorAndShowInSnackbar(response),
      next: (response) => {
        this.snackbarService.showMessage(`Administrador removido.`);
        const newAdminNicknames = this._adminNicknames.value;
        const index = newAdminNicknames.indexOf(response.nickname);
        newAdminNicknames.splice(index, 1);
        this._adminNicknames.next(newAdminNicknames);
      }
    });
  }
}
