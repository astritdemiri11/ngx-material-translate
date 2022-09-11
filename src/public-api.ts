/*
 * Public API Surface of ngx-material-translate
 */
import { LanguageCode } from './lib/models/language/language.enum';
import { Language } from './lib/models/language/language.model';
import { ResponseType } from './lib/models/response/response.enum';
import { featureKey } from './lib/state';
import * as fromLanguageReducer from './lib/state/language/language.reducer';

export { NgxMaterialTranslateModule } from './lib/ngx-material-translate.module';

export { LanguageComponent } from './lib/components/language/language.component';

export { TRANSLATE_CONFIG } from './lib/constants/injection.constants'
export { INTERNAL_FEATURE } from './lib/constants/translate.constants';

export { TranslateDirective } from './lib/directives/translate/translate.directive';

export { KeyValue } from './lib/models/key-value/key-value.interface';
export { TranslateConfig as TranslateConfigInterface } from './lib/models/configs/translate-config.interface';
export { Language as LanguageInterface, LanguageDTO } from './lib/models/language/language.interface';
export { Loader } from './lib/models/loader/loader.interface';

export { CustomError } from './lib/models/custom-error/custom-error.model';
export { Response } from './lib/models/response/response.model';
export { Language } from './lib/models/language/language.model';

export { ResponseType } from './lib/models/response/response.enum';
export { LanguageCode } from './lib/models/language/language.enum';

export { TranslatePipe } from './lib/pipes/translate/translate.pipe';

export { LanguageService } from './lib/services/language/language.service';
export { TranslateService } from './lib/services/translate/translate.service';
export { TranslationLoaderService } from './lib/services/translation-loader/translation-loader.service';

export function mockState() {
  return {
    [featureKey]: {
      [fromLanguageReducer.featureKey]: {
        ids: ['en'],
        entities: {
          en: {
            translations: { en: 'English' },
            language: new Language({ id: 0, n: 'English', c: LanguageCode.English, f: 'us' })
          }
        },
        active: LanguageCode.English,
        lastActive: LanguageCode.English,
        status: {
          en: ResponseType.Undefined
        },
        error: null
      }
    }
  };
}
