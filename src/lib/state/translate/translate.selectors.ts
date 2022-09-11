import { createSelector } from '@ngrx/store';

import { selectTranslationState, State } from '..';
import { LanguageCode } from '../../models/language/language.enum';
import { State as LanguageState } from './translate.reducer';

export const selectTranslateState = createSelector(selectTranslationState, (state: State) => {
  return state.translate
});

export const selectTranslations = createSelector(
  selectTranslateState,
  (state: LanguageState) => state.translations
);

export const selectDefaultTranslations = (feature: string) => createSelector(
  selectTranslateState,
  (state: LanguageState) => {
    if (state.defaultLanguage && state.translations[feature]) {
      if (state.translations[feature][state.defaultLanguage]) {
        return state.translations[feature][state.defaultLanguage]
      }
    }

    return null;
  }
);

export const selectFeatureTranslations = (feature: string) => createSelector(
  selectTranslateState,
  (state: LanguageState) => {
    if (state.translations[feature]) {
      return state.translations[feature]
    }

    return null;
  }
);

export const selectLanguageTranslations = (feature: string, languageCode: LanguageCode) => createSelector(
  selectTranslateState,
  (state: LanguageState) => {
    if (state.translations[feature]) {
      if (state.translations[feature][languageCode]) {
        return state.translations[feature][languageCode]
      }
    }

    return null;
  }
);

export const selectStatus = (feature: string, languageCode: LanguageCode) => createSelector(
  selectTranslateState,
  (state: LanguageState) => {
    if (state.status[feature]) {
      if (state.status[feature][languageCode]) {
        return state.status[feature][languageCode]
      }
    }

    return null;
  }
);
