import { Directive, ElementRef, Inject, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { filter, Subscription, take } from 'rxjs';
import { TRANSLATE_CONFIG } from '../../constants/injection.constants';

import { DEFAULT_FEATURE } from '../../constants/translate.constants';
import { TranslateConfig } from '../../models/configs/translate-config.model';
import { ResponseType } from '../../models/response/response.enum';
import { LanguageService } from '../../services/language/language.service';
import { TranslateService } from '../../services/translate/translate.service';

@Directive({
  selector: '[translate]'
})
export class TranslateDirective implements OnInit, OnChanges {
  @Input() translate?: string;
  @Input() translateFeature?: string;
  @Input() translateParams?: string;

  private value: string | null;

  private translatedValue: string | null;

  private subscriptions: Subscription[];

  constructor(
    @Inject(TRANSLATE_CONFIG) private translateConfig: TranslateConfig,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private translateService: TranslateService,
    private languageService: LanguageService) {
    this.value = null;

    this.translatedValue = null;

    this.subscriptions = [];
  }

  ngOnInit(): void {
    if (!this.translate) {
      throw new Error(`translate directive, translate value is required`);
    }

    if (!this.translateFeature) {
      this.translateFeature = DEFAULT_FEATURE;
    }

    this.value = this.translate;

    this.subscriptions.push(this.languageService.model.activeLanguageCode$.subscribe(languageCode => {
      const lastActiveLanguageCode = this.languageService.business.getLastActiveLanguageCode();

      const firstLoad = languageCode === lastActiveLanguageCode;

      if (!this.translateFeature) {
        return;
      }

      if (!firstLoad && this.translateConfig.translationLoadingClass && this.translatedValue) {
        this.renderer2.setProperty(this.elementRef.nativeElement, 'innerHTML', `<span class="${this.translateConfig.translationLoadingClass}">${this.translatedValue}</span>`);
      }

      this.translateService.model.status(this.translateFeature).pipe(
        filter(status => status === ResponseType.Success), take(1)
      ).subscribe(() => this.translateValue(firstLoad))
    }));
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.translate) {
      throw new Error(`translate directive, translate value is required`);
    }

    if (!this.translateFeature) {
      this.translateFeature = DEFAULT_FEATURE;
    }

    if (!this.hasChanges()) {
      return;
    }

    this.value = this.translate;

    this.translateValue(true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private translateValue(firstLoad: boolean) {
    if (this.translate && this.translateFeature) {
      const translatedValue = this.translateService.business.getTranslation(this.translateFeature, this.translate);

      if (translatedValue) {
        this.translatedValue = translatedValue;
      } else {
        this.translatedValue = this.translate;
      }

      if (!firstLoad && this.translateConfig.translationSuccessClass) {
        this.renderer2.setProperty(this.elementRef.nativeElement, 'innerHTML', `<span class="${this.translateConfig.translationSuccessClass}">${this.translatedValue}</span>`);
      } else {
        this.renderer2.setProperty(this.elementRef.nativeElement, 'innerHTML', this.translatedValue);
      }
    }
  }

  private hasChanges() {
    return this.translate !== this.value;
  }
}
