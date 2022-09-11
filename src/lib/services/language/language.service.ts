import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { TRANSLATE_CONFIG } from '../../constants/injection.constants';
import { TranslateConfig } from '../../models/configs/translate-config.model';
import { LanguageCode } from '../../models/language/language.enum';
import { Language as LanguageInterface, LanguageDTO } from '../../models/language/language.interface';
import { Language } from '../../models/language/language.model';
import { ResponseType } from '../../models/response/response.enum';
import * as LanguageActions from '../../state/language/language.actions';
import * as fromLanguageReducer from '../../state/language/language.reducer';
import * as LanguageSelectors from '../../state/language/language.selectors';
import { TranslationLoaderService } from '../translation-loader/translation-loader.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(@Inject(TRANSLATE_CONFIG) private translateConfigs: TranslateConfig,
    private store: Store<fromLanguageReducer.State>,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(LanguageSelectors.selectLanguageState),
      activeLanguageCode$: this.store.select(LanguageSelectors.selectActiveLanguageCode),
      activeLanguage$: this.store.select(LanguageSelectors.selectActiveLanguage),
      lastActiveLanguageCode$: this.store.select(LanguageSelectors.selectLastActiveLanguageCode),
      status$: this.store.select(LanguageSelectors.selectStatus),
      languages$: this.store.select(LanguageSelectors.selectLanguages),
      languageEntities$: this.store.select(LanguageSelectors.selectLanguageEntities),
      language: (languageCode: LanguageCode) => {
        return this.store.select(LanguageSelectors.selectLanguage(languageCode));
      }
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTOs: this.translateConfigs.languageConverter,
      getActiveLanguage(): LanguageInterface | null {
        let language: LanguageInterface | null = null;

        self.model.activeLanguage$.pipe(take(1)).subscribe(activeLanguage => language = activeLanguage);

        return language;
      },
      getActiveLanguageCode(): LanguageCode {
        let active = LanguageCode.Undefined;

        self.model.activeLanguageCode$.pipe(take(1)).subscribe(activeCode => active = activeCode);

        return active;
      },
      getLastActiveLanguageCode(): LanguageCode {
        let active = LanguageCode.Undefined;

        self.model.lastActiveLanguageCode$.pipe(take(1)).subscribe(lastActive => active = lastActive);

        return active;
      },
      getLanguageEntities(): { [key: string]: Language } {
        let languages = {};

        self.model.languageEntities$.pipe(take(1)).subscribe(entities => languages = entities);

        return languages;
      },
      selectLanguage: (languageCode: LanguageCode) => {
        const availableLanguages = Object.values(LanguageCode).filter(key => key !== LanguageCode.Undefined);

        if (!availableLanguages.includes(languageCode)) {
          throw new Error('Can not set an unknown language code');
        }

        self.model.language(languageCode).pipe(take(1)).subscribe(language => {
          if (!language) {
            const newLanguage = new Language({ id: 0, n: '', c: languageCode, f: '' }, ResponseType.Loading);
            self.store.dispatch(LanguageActions.selectFakeLanguage({ languageCode, language: newLanguage }));
          } else {
            self.store.dispatch(LanguageActions.selectLanguage({ languageCode }));
          }
        })
      },
      loadLanguages: (path?: string, force: boolean = false) => {
        self.model.status$.pipe(take(1)).subscribe(responseType => {
          if (!force && responseType === ResponseType.Success) {
            return;
          }

          const languageCode = self.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot load languages without setting an initial language!')
          }

          path = path || this.translateConfigs.languagesPath;

          self.store.dispatch(LanguageActions.loadLanguages({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      },
      addLanguages: (languages: Language[]) => {
        const languageCode = self.business.getActiveLanguageCode();

        if (!languageCode) {
          throw new Error('Cannot load languages without setting an initial language!')
        }

        self.store.dispatch(LanguageActions.loadLanguagesSuccess({ languageCode, languages }));
      },
      translateLanguages: (path?: string, force: boolean = false) => {
        self.model.status$.pipe(take(1)).subscribe(responseType => {
          if (!force && responseType === ResponseType.Success) {
            return;
          }

          const languageCode = self.business.getActiveLanguageCode();

          if (!languageCode) {
            throw new Error('Cannot translate languages without setting a default language!')
          }

          path = path || this.translateConfigs.languagesTranslatePath;

          self.store.dispatch(LanguageActions.translateLanguages({ path: `${path}/${languageCode}.json`, languageCode }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadLanguages: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<LanguageDTO[], { languageCode: LanguageCode }>
          (path, {}, { languageCode });
      },
      translateLanguages: (path: string, languageCode: LanguageCode) => {
        return self.translationLoaderService.get<LanguageDTO[], { languageCode: LanguageCode }>
          (path, {}, { languageCode });
      }
    }
  }
}
