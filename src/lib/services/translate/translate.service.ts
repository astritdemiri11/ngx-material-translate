import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { TRANSLATE_CONFIG } from '../../constants/injection.constants';
import { DEFAULT_FEATURE } from '../../constants/translate.constants';
import { TranslateConfig } from '../../models/configs/translate-config.interface';
import { KeyValue } from '../../models/key-value/key-value.interface';
import { LanguageCode } from '../../models/language/language.enum';
import { ResponseType } from '../../models/response/response.enum';
import * as TranslateActions from '../../state/translate/translate.actions';
import * as fromTranslateReducer from '../../state/translate/translate.reducer';
import * as TranslateSelectors from '../../state/translate/translate.selectors';
import { LanguageService } from '../language/language.service';
import { TranslationLoaderService } from '../translation-loader/translation-loader.service';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(@Inject(TRANSLATE_CONFIG) private translateConfigs: TranslateConfig,
    private store: Store<fromTranslateReducer.State>,
    private translationLoaderService: TranslationLoaderService,
    private languageService: LanguageService) { }

  private getModel() {
    return {
      state$: this.store.select(TranslateSelectors.selectTranslateState),
      translations$: this.store.select(TranslateSelectors.selectTranslations),
      defaultTranslations: (feature: string) => {
        return this.store.select(TranslateSelectors.selectDefaultTranslations(feature));
      },
      featureTranslations: (feature: string) => {
        return this.store.select(TranslateSelectors.selectFeatureTranslations(feature));
      },
      languageTranslations: (feature: string) => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(TranslateSelectors.selectLanguageTranslations(feature, languageCode));
      },
      status: (feature: string) => {
        const languageCode = this.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('There is no active language');
        }

        return this.store.select(TranslateSelectors.selectStatus(feature, languageCode));
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      addTranslations: (translationData: KeyValue<string | KeyValue<string>>, feature: string = DEFAULT_FEATURE) => {
        const languageCode = self.languageService.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('Cannot load translations before selecting an initial language');
        }

        self.store.dispatch(TranslateActions.loadTranslationsSuccess({ feature, languageCode, translationData }));
      },
      loadTranslations: (feature: string = DEFAULT_FEATURE, path?: string, force: boolean = false) => {

        self.model.status(feature).pipe(take(1)).subscribe(responseType => {
          if (!force && responseType === ResponseType.Success) {
            return;
          }

          const languageCode = self.languageService.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load translations before selecting an initial language');
          }

          path = path || `${this.translateConfigs.path}/${feature}`;

          self.store.dispatch(TranslateActions.loadTranslations({ path: `${path}/${languageCode}.json`, feature, languageCode }));
        })
      },
      getDefaultTranslations: (feature: string) => {
        let languageTranslations: KeyValue<string | KeyValue<string>> | null = null;
        self.model.defaultTranslations(feature).pipe(take(1)).subscribe(translations => languageTranslations = translations);

        return languageTranslations;
      },
      getTranslation: (feature: string, translateKey: string): string | null => {
        let translate: string | null = null;

        self.model.languageTranslations(feature).pipe(take(1)).subscribe(languageTranslations => {
          if (!languageTranslations) {
            languageTranslations = this.business.getDefaultTranslations(feature);
          }

          if (languageTranslations) {
            let languageTranslation = languageTranslations[translateKey];

            if (typeof languageTranslation === 'string') {
              translate = languageTranslation;
            } else {
              const translateKeys = translateKey.split('.');

              if (translateKeys.length === 2) {
                let nestedTranslation = languageTranslations[translateKeys[0]];

                if (nestedTranslation) {
                  if (typeof nestedTranslation === 'string') {
                    translate = nestedTranslation;
                  } else {
                    let nestedValue = nestedTranslation[translateKeys[1]];

                    if (nestedValue) {
                      translate = nestedValue;
                    }
                  }
                }
              }
            }
          }
        });

        return translate;
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadTranslations: (path: string, feature: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<KeyValue<string | KeyValue<string>>, { feature: string, languageCode: LanguageCode }>
          (path, {}, { feature, languageCode });
      }
    }
  }
}
