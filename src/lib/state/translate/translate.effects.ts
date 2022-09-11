import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { CustomError } from '../../models/custom-error/custom-error.interface';
import { LanguageCode } from '../../models/language/language.enum';
import { TranslateService } from '../../services/translate/translate.service';
import * as TranslateActions from './translate.actions';
import * as fromTranslateReducer from './translate.reducer';


@Injectable()
export class TranslateEffects {
  loadTranslation$ = createEffect(() => this.actions$.pipe(
    ofType(TranslateActions.loadTranslations),
    mergeMap(action => {
      return this.translateService.request.loadTranslations(action.path, action.feature, action.languageCode);
    }),
    catchError((error: CustomError<{ languageCode: LanguageCode, feature: string }>, caught) => {
      this.store.dispatch(TranslateActions.loadTranslationsFailure({  languageCode: error.append.languageCode, feature: error.append.feature,  error: error.message }));
      return caught;
    }),
    map(response => {
      return TranslateActions.loadTranslationsSuccess({ feature: response.append.feature, languageCode: response.append.languageCode, translationData: response.data });
    })
  ));


  constructor(private actions$: Actions, private store: Store<fromTranslateReducer.State>, private translateService: TranslateService) {}
}
