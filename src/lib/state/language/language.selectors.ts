import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { selectTranslationState, State } from '..';
import { LanguageCode } from '../../models/language/language.enum';
import { Language, LanguageTranslation } from '../../models/language/language.interface';
import { adapter, State as LanguageState } from './language.reducer';

export const selectLanguageState = createSelector(selectTranslationState, (state: State) => {
  return state.language
});

const {
  selectEntities,
  selectAll
} = adapter.getSelectors(selectLanguageState);

export const selectLanguages = createSelector(
  selectLanguageState,
  selectAll,
  (state: LanguageState, languageTranslations: LanguageTranslation[]): (Language | null)[] => languageTranslations.map(languageTranslation => {
    const translation = languageTranslation.translations[state.active];

    if (!translation) {
      return null;
    }

    return { ...languageTranslation.language, name: translation }
  })
);

export const selectLanguage = (languageCode: LanguageCode) => createSelector(
  selectEntities,
  (languageTranslations: Dictionary<LanguageTranslation>): Language | null => {
    if (!languageTranslations) {
      return null;
    }

    const languageTranslation = languageTranslations[languageCode];

    if (!languageTranslation) {
      return null;
    }

    return { ...languageTranslation.language, name: languageTranslation.translations[languageCode] };
  }
);

export const selectActiveLanguageCode = createSelector(
  selectLanguageState,
  (state: LanguageState) => state.active
);

export const selectStatus = createSelector(
  selectLanguageState,
  (state: LanguageState) => {
    if (state.status[state.active]) {
      return state.status[state.active]
    }

    return null;
  }
);

export const selectLanguageEntities = createSelector(
  selectLanguageState,
  selectEntities,
  (state: LanguageState, languageTranslations: Dictionary<LanguageTranslation>): { [key: string]: Language } => {
    const languages: { [key: string]: Language } = {};

    for (const languageCode in languageTranslations) {
      const languageTranslation = languageTranslations[languageCode];

      if (languageTranslation) {
        languages[languageCode] = { ...languageTranslation.language, name: languageTranslation.translations[state.active] };
      }
    }

    return languages;
  }
);

export const selectActiveLanguage = createSelector(
  selectLanguageState,
  selectEntities,
  (state: LanguageState, languageTranslations: Dictionary<LanguageTranslation>): Language | null => {
    const languageTranslation = languageTranslations[state.active];

    if (!languageTranslation) {
      return null;
    }

    return { ...languageTranslation.language, name: languageTranslation.translations[state.active] };
  }
);

export const selectLastActiveLanguageCode = createSelector(
  selectLanguageState,
  (state: LanguageState): LanguageCode => state.lastActive
);


