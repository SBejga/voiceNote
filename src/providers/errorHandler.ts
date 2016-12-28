import {ErrorHandler} from '@angular/core';

/*
 * Führt die Fehlerbehandlung durch
 */
export class ErrorHandlerService implements ErrorHandler {
  handleError(err: any): void {
    console.error(err);
  }
}
