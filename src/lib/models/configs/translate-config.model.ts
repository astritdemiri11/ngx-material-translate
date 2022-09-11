import { Provider } from '@angular/core';

import { FLAG_PATH, LANGUAGE_PATH } from '../../constants/language.constants';
import { PATH } from '../../constants/translate.constants';
import { LanguageCode } from '../language/language.enum';
import { LanguageDTO } from '../language/language.interface';
import { Language } from '../language/language.model';
import { LanguageConverterFn, TranslateConfig as TranslateConfigInterface } from './translate-config.interface';

export class TranslateConfig implements TranslateConfigInterface {
  loader: Provider | null;
  defaultLanguage: LanguageCode;
  path: string;
  languagesPath: string;
  languagesTranslatePath: string;
  flagsPath: string;
  translationLoadingClass: string;
  translationSuccessClass: string;
  languageConverter: LanguageConverterFn<LanguageDTO>

  constructor(configs?: TranslateConfigInterface) {
    configs = configs || {};

    this.loader = configs.loader ? configs.loader : null;
    this.defaultLanguage = configs.defaultLanguage || LanguageCode.Undefined;
    this.path = configs.path || PATH;
    this.languagesPath = configs.languagesPath || LANGUAGE_PATH;
    this.languagesTranslatePath = configs.languagesTranslatePath || this.languagesPath;
    this.flagsPath = configs.flagsPath || FLAG_PATH;
    this.translationLoadingClass = configs.translationLoadingClass ? configs.translationLoadingClass : '';
    this.translationSuccessClass = configs.translationSuccessClass ? configs.translationSuccessClass : '';

    if(configs.languageConverter) {
      this.languageConverter = configs.languageConverter;
    } else {
      this.languageConverter = (languageDTOs: LanguageDTO[]) => {
        return languageDTOs.map(languageDTO => new Language(languageDTO));
      };
    }
  }
}
