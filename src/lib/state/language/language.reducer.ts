import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Action, createReducer, on } from '@ngrx/store';

import { LanguageCode } from '../../models/language/language.enum';
import { LanguageTranslation as LanguageTranslationInterface } from '../../models/language/language.interface';
import { Language, LanguageTranslation } from '../../models/language/language.model';
import { ResponseType } from '../../models/response/response.enum';
import * as LanguageActions from './language.actions';

export interface State extends EntityState<LanguageTranslationInterface> {
  active: LanguageCode;
  lastActive: LanguageCode;
  status: {
    [languageCode: string]: ResponseType
  };
  error: string | null;
}

export function selectId(languageTranslation: LanguageTranslationInterface): LanguageCode {
  return languageTranslation.language.code;
}

export function sortByName(aLanguageTranslation: LanguageTranslationInterface, bLanguageTranslation: LanguageTranslationInterface): number {
  return aLanguageTranslation.language.id - bLanguageTranslation.language.id
  // return aLanguage.name.localeCompare(bLanguage.name);
}

export const adapter: EntityAdapter<LanguageTranslationInterface> = createEntityAdapter<LanguageTranslationInterface>({
  selectId: selectId,
  sortComparer: sortByName
});

const initialState: State = adapter.getInitialState({
  ids: ['en'],
  entities: {
    en: new LanguageTranslation(LanguageCode.English, new Language({ id: 0, n: 'English', c: LanguageCode.English, f: 'us' }))
  },
  active: LanguageCode.English,
  lastActive: LanguageCode.English,
  status: {
    en: ResponseType.Undefined
  },
  error: null
});

const languageReducer = createReducer(initialState,
  on(LanguageActions.loadLanguages, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(LanguageActions.loadLanguagesSuccess, (state: State, { languageCode, languages }) => {
    const copyState = adapter.setAll(languages.map(language => new LanguageTranslation(languageCode, language)), { ...state, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(LanguageActions.loadLanguagesFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(LanguageActions.translateLanguages, (state: State, { languageCode }) => {
    const copyState = { ...state, error: null };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Loading;

    return copyState;
  }),
  on(LanguageActions.translateLanguagesSuccess, (state: State, { languageCode, translations }) => {
    const updates: UpdateStr<LanguageTranslation>[] = [];

    for (const languageTranslation of translations) {
      const entity = { ...state.entities[languageTranslation.id] };
      const update = { ...languageTranslation };

      update.changes = { ...languageTranslation.changes };
      update.changes.translations = { ...languageTranslation.changes.translations, ...entity.translations }

      updates.push(update);
    }

    const copyState = adapter.updateMany(updates, state);

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Success;

    return copyState;
  }),
  on(LanguageActions.translateLanguagesFailure, (state: State, { languageCode, error }) => {
    const copyState = { ...state, error };

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Failure;

    return copyState;
  }),

  on(LanguageActions.selectFakeLanguage, (state: State, { languageCode, language }) => {
    const copyState = adapter.addOne(new LanguageTranslation(languageCode, language), { ...state, lastActive: language.code, active: language.code, error: null });

    copyState.status = { ...copyState.status };
    copyState.status[languageCode] = ResponseType.Undefined;

    return copyState;
  }),

  on(LanguageActions.selectLanguage, (state: State, { languageCode }) => {
    return { ...state, lastActive: state.active, active: languageCode };
  }));

export function reducer(state: State | undefined, action: Action) {
  return languageReducer(state, action);
}

export const featureKey = 'language';
