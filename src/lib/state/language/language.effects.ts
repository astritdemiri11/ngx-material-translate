import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs';

import { CustomError } from '../../models/custom-error/custom-error.interface';
import { LanguageCode } from '../../models/language/language.enum';
import { LanguageTranslation } from '../../models/language/language.model';
import { LanguageService } from '../../services/language/language.service';
import * as LanguageActions from './language.actions';
import * as fromLanguageReducer from './language.reducer';

@Injectable()
export class LanguageEffects {
  loadLanguages$ = createEffect(() => this.actions$.pipe(
    ofType(LanguageActions.loadLanguages),
    switchMap(action => {
      return this.languageService.request.loadLanguages(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(LanguageActions.loadLanguagesFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const languages = this.languageService.business.convertDTOs(response.data);
      return LanguageActions.loadLanguagesSuccess({ languageCode: response.append.languageCode, languages });
    })
  ));

  translateLanguages$ = createEffect(() => this.actions$.pipe(
    ofType(LanguageActions.translateLanguages),
    switchMap(action => {
      return this.languageService.request.translateLanguages(action.path, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode }>, caught) => {
      this.store.dispatch(LanguageActions.translateLanguagesFailure({ languageCode: error.append.languageCode, error: error.message }));
      return caught;
    }),
    map(response => {
      const languages = this.languageService.business.convertDTOs(response.data);
      const translations: UpdateStr<LanguageTranslation>[] = languages.map(language => ({
        id: language.code, changes: {
          translations: {
            [response.append.languageCode]: language.name
          }
        }
      }));

      return LanguageActions.translateLanguagesSuccess({ languageCode: response.append.languageCode, translations });
    })
  ));

  constructor(private actions$: Actions, private store: Store<fromLanguageReducer.State>, private languageService: LanguageService) { }
}
