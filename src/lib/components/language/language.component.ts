import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, take } from 'rxjs';

import { TRANSLATE_CONFIG } from '../../constants/injection.constants';
import { TranslateConfig } from '../../models/configs/translate-config.interface';
import { LanguageCode } from '../../models/language/language.enum';
import { ResponseType } from '../../models/response/response.enum';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'mat-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
/*Displays the languages loaded or configured.*/
export class LanguageComponent implements OnInit, OnDestroy {
  @Input() classList?: string;
  responseStatus: typeof ResponseType;
  selectedLanguage: LanguageCode;

  private subscriptions: Subscription[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(TRANSLATE_CONFIG) private configs: TranslateConfig,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public languageService: LanguageService) {
    this.subscriptions = [];

    this.responseStatus = ResponseType;
    this.selectedLanguage = LanguageCode.Undefined;
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  onLanguageSet() {
    this.languageService.business.selectLanguage(this.selectedLanguage);
  }

  ngOnInit() {
    if(!this.classList) {
      this.classList = '';
    }

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => this.selectedLanguage = languageCode));

    this.languageService.model.languages$.pipe(take(1)).subscribe(languages => {
      for (const language of languages) {
        if (this.isBrowser() && language && language.flag) {
          this.matIconRegistry.addSvgIconInNamespace('flag', language.flag,
            this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.configs.flagsPath}/${language.flag}.svg`))
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
