import { UpdateStr } from '@ngrx/entity/src/models';
import { createAction, props } from '@ngrx/store';

import { LanguageCode } from '../../models/language/language.enum';
import { Language } from '../../models/language/language.interface';
import { LanguageTranslation } from '../../models/language/language.model';


export const loadLanguages = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] LOAD', props<{ path: string, languageCode: LanguageCode }>());
export const loadLanguagesSuccess = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] LOAD_SUCCESS', props<{ languageCode: LanguageCode, languages: Language[] }>());
export const loadLanguagesFailure = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] LOAD_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const translateLanguages = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] TRANSLATE', props<{ path: string, languageCode: LanguageCode }>());
export const translateLanguagesSuccess = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] TRANSLATE_SUCCESS', props<{ languageCode: LanguageCode, translations: UpdateStr<LanguageTranslation>[] }>());
export const translateLanguagesFailure = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] TRANSLATE_FAILURE', props<{ languageCode: LanguageCode, error: string }>());

export const selectFakeLanguage = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] SELECT_FAKE', props<{ languageCode: LanguageCode, language: Language }>());
export const selectLanguage = createAction('[NGX_MATERIAL_TRANSLATE_LANGUAGE] SELECT', props<{ languageCode: LanguageCode }>());
