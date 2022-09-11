import { ResponseType } from '../response/response.enum';
import { LanguageCode } from './language.enum';
import {
  Language as LanguageInterface,
  LanguageDTO,
  LanguageTranslation as LanguageTranslationInterface,
} from './language.interface';

export class Language implements LanguageInterface {
  id: number;
  name: string;
  code: LanguageCode;
  flag: string;


  constructor(languageDTO?: LanguageDTO, public status = ResponseType.Success, public error: string | null = null) {
    languageDTO = languageDTO || { id: 0, n: '', c: LanguageCode.Undefined, f: '' };

    this.id = languageDTO.id;
    this.name = languageDTO.n;
    this.code = languageDTO.c;
    this.flag = languageDTO.f;
  }
}

export class LanguageTranslation implements LanguageTranslationInterface {
  translations: { [languageCode: string]: string; };

  constructor(languageCode: LanguageCode, public language: Language) {
    this.translations = {
      [languageCode]: language.name
    };
  }
}
