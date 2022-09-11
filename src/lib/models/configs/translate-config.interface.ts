import { Provider } from '@angular/core';

import { LanguageCode } from '../language/language.enum';
import { Language } from '../language/language.interface';

export interface LanguageConverterFn<T> {
  (languageDTOs: T[]): Language[]
}

export interface TranslateConfig {
  /**
   * Loader must be provided if the data are loaded via a server.
   * @property
   * 'deps' can be a HTTPClient or any custom http service.
   * @default null is the default value
   */
  loader?: Provider | null,
  /**
   * Language provided initially or if the selected language is not provided.
   * @default null is the default value
   */
  defaultLanguage?: LanguageCode,
  /**
   * Common folder path where to find the translate assets.
   * @default '/assets/i18n' is the default value
   */
  path?: string;
  /**
   * Folder path where to load languages.
   * @default '/assets/i18n/material-translate/language' is the default value
   */
  languagesPath?: string;
  /**
   * Folder path where to translate languages. Default value is as load path.
   * @default '/assets/i18n/material-translate/language' is the default value
   */
   languagesTranslatePath?: string;
  /**
   * Folder path where to find the icons assets.
   * @default '/assets/images/svg/flags' is the default value
   */
  flagsPath?: string;
  /**
   * Generic method to convert custom language object into Language object type.
   * @default
   * ```
   * (languageDTOs: LanguageDTO[]) => Language[]
   *
   * ```
   * ### HOW YOU CAN USE IT
   * ```
   * (serverData: any[]) => {
   *  const languages: Language[] = [];
   *
   *  for(const langData of serverData) {
   *    const language = new Language();
   *    language.id = langData.id;
   *    // map all properties.
   *
   *    languages.push(language);
   *  }
   * }
   *
   * return languages;
   * ```
   */
  languageConverter?: LanguageConverterFn<any>;
  /**
   * Class name set to the translation element when the language changes.
   * @default null is the default value
   */
   translationLoadingClass?: string;
   /**
   * Class name set to the translation element when the translation loaded.
   * @default null is the default value
   */
    translationSuccessClass?: string;

}
