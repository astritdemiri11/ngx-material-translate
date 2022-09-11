import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { filter, Subscription, take } from 'rxjs';

import { DEFAULT_FEATURE } from '../../constants/translate.constants';
import { ResponseType } from '../../models/response/response.enum';
import { LanguageService } from '../../services/language/language.service';
import { TranslateService } from '../../services/translate/translate.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  oldValue: string | null;
  oldParams: string | null;
  translatedValue: string | null;
  params: string[];

  private subscriptions: Subscription[];

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService) {
    this.oldValue = null;
    this.oldParams = null;
    this.translatedValue = null;
    this.params = [];

    this.subscriptions = [];
  }

  transform(value: string, feature = DEFAULT_FEATURE, params: string | null = null): string {
    if (!value || typeof value !== 'string') {
      throw new Error('Translate pipe requires a string value')
    }

    if (value !== this.oldValue || params !== this.oldParams) {
      this.translatedValue = null;
    }

    if (this.translatedValue) {
      return this.translatedValue;
    }

    if (params) {
      this.params = params.split(',');

      for (let i = 0; i < this.params.length; i++) {
        this.params[i] = this.params[i].trim();
      }
    }

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(() => {
      this.translateService.model.status(feature).pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => {
        const translatedValue = this.translateService.business.getTranslation(feature, value);

        if (translatedValue) {
          this.translatedValue = translatedValue;
        } else {
          this.translatedValue = value;
        }
      })
    }))

    if (!this.translatedValue) {
      this.translatedValue = value;
    }

    this.oldValue = value;
    this.oldParams = params;

    return this.translatedValue;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
