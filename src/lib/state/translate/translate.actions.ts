import { createAction, props } from '@ngrx/store';

import { KeyValue } from '../../models/key-value/key-value.interface';
import { LanguageCode } from '../../models/language/language.enum';

export const loadTranslations = createAction('[NGX_MATERIAL_TRANSLATE_TRANSLATION] LOAD',
  props<{ feature: string, languageCode: LanguageCode, path: string }>());
export const loadTranslationsSuccess = createAction('[NGX_MATERIAL_TRANSLATE_TRANSLATION] LOAD_SUCCESS',
  props<{ feature: string, languageCode: LanguageCode, translationData: KeyValue<string | KeyValue<string>> }>());
export const loadTranslationsFailure = createAction('[NGX_MATERIAL_TRANSLATE_TRANSLATION] LOAD_FAILURE',
  props<{ feature: string, languageCode: LanguageCode, error: string }>());
