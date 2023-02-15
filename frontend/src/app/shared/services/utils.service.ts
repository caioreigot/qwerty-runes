import { Injectable } from "@angular/core";
import { Snackbar } from './snackbar.service';

@Injectable({ providedIn: 'root' })
export class UtilsService {

  snackbar: Snackbar = new Snackbar();

  handleResponseErrorAndShowInSnackbar(response: any) {
    const message: any = response.error.message;
    
    if (!message) {
      this.snackbar.open('Ocorreu um erro inesperado.', 3000, true);
      return;
    }

    const errorMessage = message instanceof Array ? message[0] : message;
    this.snackbar.open(errorMessage, 3000, true);
  }
}