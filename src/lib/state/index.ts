import { Action, ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromLanguageReducer from './language/language.reducer';
import * as fromTranslateReducer from './translate/translate.reducer';

export interface State {
  [fromLanguageReducer.featureKey]: fromLanguageReducer.State,
  [fromTranslateReducer.featureKey]: fromTranslateReducer.State
}

export const reducers: ActionReducerMap<State, Action> = {
  [fromLanguageReducer.featureKey]: fromLanguageReducer.reducer,
  [fromTranslateReducer.featureKey]: fromTranslateReducer.reducer
};

export const featureKey = 'ngx-material-translation';

export const selectTranslationState = createFeatureSelector<State>(featureKey);
