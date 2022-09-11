import { Action, createReducer, on } from '@ngrx/store';

import { KeyValue } from '../../models/key-value/key-value.interface';
import { LanguageCode } from '../../models/language/language.enum';
import { ResponseType } from '../../models/response/response.enum';
import * as TranslationActions from './translate.actions';

export interface State {
  defaultLanguage: LanguageCode | null;
  translations: {
    [feature: string]: { [languageCode: string]: KeyValue<string | KeyValue<string>> }
  };
  status: {
    [feature: string]: { [languageCode: string]: ResponseType }
  };
  error: string | null
}

const initialState: State = {
  defaultLanguage: null,
  translations: {},
  status: {},
  error: null
};

export const translateReducer = createReducer(
  initialState,

  on(TranslationActions.loadTranslations, (state: State, { feature, languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[feature] = { ...copyState.status[feature] }
    copyState.status[feature][languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(TranslationActions.loadTranslationsSuccess, (state, { feature, languageCode, translationData }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[feature] = { ...copyState.status[feature] }
    copyState.status[feature][languageCode] = ResponseType.Success;

    copyState.translations = { ...copyState.translations };
    copyState.translations[feature] = { ...copyState.translations[feature] }
    copyState.translations[feature][languageCode] = { ...copyState.translations[feature][languageCode] }
    copyState.translations[feature][languageCode] = translationData;

    return copyState;
  }),
  on(TranslationActions.loadTranslationsFailure, (state: State, { feature, languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[feature] = { ...copyState.status[feature] }
    copyState.status[feature][languageCode] = ResponseType.Failure;

    return copyState;
  })
);

export function reducer(state: State | undefined, action: Action) {
  return translateReducer(state, action);
}

export const featureKey = 'translate';
