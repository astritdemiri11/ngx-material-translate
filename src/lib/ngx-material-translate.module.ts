import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { LanguageComponent } from './components/language/language.component';
import { TRANSLATE_CONFIG } from './constants/injection.constants';
import { TranslateDirective } from './directives/translate/translate.directive';
import { TranslateConfig as TranslateConfigInterface } from './models/configs/translate-config.interface';
import { TranslateConfig } from './models/configs/translate-config.model';
import { TranslatePipe } from './pipes/translate/translate.pipe';
import { TranslationLoaderService } from './services/translation-loader/translation-loader.service';
import { featureKey, reducers } from './state';
import { LanguageEffects } from './state/language/language.effects';
import { TranslateEffects } from './state/translate/translate.effects';

const materialModules = [
  MatIconModule,
  MatSelectModule
];

@NgModule({
  declarations: [
    LanguageComponent,
    TranslatePipe,
    TranslateDirective
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([LanguageEffects, TranslateEffects]),
    materialModules,
    StoreModule.forFeature(featureKey, reducers)
  ],
  exports: [
    LanguageComponent,
    TranslatePipe,
    TranslateDirective
  ]
})
export class MaterialTranslateModule {
  static forRoot(config?: TranslateConfigInterface): ModuleWithProviders<MaterialTranslateModule> {
    config = new TranslateConfig(config);

    return {
      ngModule: MaterialTranslateModule,
      providers: [
        { provide: TRANSLATE_CONFIG, useValue: config },
        config.loader || {
          provide: TranslationLoaderService, useFactory: () => ({
            get: () => of({})
          })
        }
      ]
    }
  }

  static forChild(config?: TranslateConfigInterface): ModuleWithProviders<MaterialTranslateModule> {
    config = new TranslateConfig(config);

    return {
      ngModule: MaterialTranslateModule,
      providers: [
        { provide: TRANSLATE_CONFIG, useValue: config },
        config.loader || {
          provide: TranslationLoaderService, useFactory: () => ({
            get: () => of({})
          })
        }
      ]
    }
  }
}
