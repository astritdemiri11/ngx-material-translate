import { Response } from '../response/response.interface';
import { LanguageCode } from './language.enum';

export interface LanguageDTO {
  id: number;
  n: string;
  c: LanguageCode;
  f: string;
}

export interface Language extends Response {
  id: number;
  name: string;
  code: LanguageCode;
  flag: string;
}

export interface LanguageTranslation {
  language: Language;
  translations: {
    [languageCode: string]: string
  };
}
