import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { TRANSLATE_LOADER } from '../../constants/injection.constants';
import { CustomError } from '../../models/custom-error/custom-error.model';
import { HTTPLoader, Loader } from '../../models/loader/loader.interface';
import { ResponseType } from '../../models/response/response.enum';
import { Response } from '../../models/response/response.model';

@Injectable({ providedIn: 'root' })
export class TranslationLoaderService implements Loader {
  constructor(@Inject(TRANSLATE_LOADER) private httpLoader: HTTPLoader) { }

  get<T, U>(url: string, options: Object, append: U): Observable<{ append: U, data: T }> {
    return this.httpLoader.get<T>(url, options).pipe(
      catchError((error: { message: string }) => {
        throw new CustomError<U>(error.message, append);
      }),
      map(responseSerialized => {
        const response = new Response<T>(responseSerialized, ResponseType.Success, null);
        return { append, data: response.data }
      }));
  }
}
