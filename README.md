# ngx-material-translate

The internationalization (i18n) library (including @angular/material, @ngrx/store, @ngrx/effects, @ngrx/entity) for Angular.

Official documentation: https://astritdemiri.com/ng-library/ngx-material-translate

Simple example using ngx-material-translate: https://stackblitz.com/github/astritdemiri11/ngx-material-translate-example

Get the complete changelog here: https://github.com/astritdemiri11/ngx-material-translate/releases

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
  * [Import the MaterialTranslateModule](#1-import-the-materialtranslatemodule)
    * [SharedModule](#sharedmodule)
    * [Lazy loaded modules](#lazy-loaded-modules)
    * [Configuration](#configuration)
    * [AoT](#aot)
  * [Define the default language for the application](#2-define-the-default-language-for-the-application)
  * [Init the TranslateService for your application](#3-init-the-languageservice-and-translateservice-for-your-application)
  * [Define the translations](#4-define-the-translations)
  * [Use the service, the pipe, the directive or the component](#5-use-the-service-the-pipe-the-directive-or-the-component)
  * [Use HTML tags](#6-use-html-tags)

## Installation

First you need to install the npm module:

```sh
npm install ngx-material-translate --save
```

Choose the version corresponding to your Angular version:

 Angular       | ngx-material-translate
 ------------- | ---------------
 14 (ivy only) | 1.x+           


## Usage

#### 1. Import the `MaterialTranslateModule`:

Finally, you can use ngx-material-translate in your Angular project. You have to import `MaterialTranslateModule` in the root NgModule of your application.

```ts
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MaterialTranslateModule, TranslationLoaderService} from 'ngx-material-translate';

@NgModule({
    imports: [
        BrowserModule,
        MaterialTranslateModule.forRoot({
          loader: { provide: TranslationLoaderService, useClass: CustomTranslationLoader }
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

##### SharedModule

If you use a [`SharedModule`](https://angular.io/guide/sharing-ngmodules) that you import in multiple other feature modules,
you can export the `MaterialTranslateModule` to make sure you don't have to import it in every module.

```ts
@NgModule({
    imports: [
      MaterialTranslateModule.forChild({
        loader: { provide: TranslationLoaderService, useClass: CustomTranslationLoader }
      })
    ],
    exports: [
        CommonModule,
        MaterialTranslateModule
    ]
})
export class SharedModule { }
```

> Note: Never call a `forRoot` static method in the `SharedModule`. You might end up with different instances of the service in your injector tree. But you can use `forChild` if necessary.

##### Lazy loaded modules

When you lazy load a module, you should use the `forChild` static method to import the `MaterialTranslateModule`.

Since lazy loaded modules use a different injector from the rest of your application, you can configure them separately with a different loader translations handler.

```ts
@NgModule({
    imports: [
        MaterialTranslateModule.forChild({
            loader: { provide: TranslationLoaderService, useClass: CustomTranslationLoader }
        })
    ]
})
export class LazyLoadedModule { }
```

##### Configuration

By default, there is no loader available. You can add translations manually using `addTranslations` but it is better to use a loader.
You can write your own loader, or import an existing one.
For example you can use the [`HttpClient`](https://angular.io/api/common/http/HttpClient) that will load translations from files using HttpClient.

Once you've decided which loader to use, you have to setup the `MaterialTranslateModule` to use it.

Here is how you would use the `HttpClient` to load translations from "/assets/i18n/[lang].json" (`[lang]` is the lang that you're using, for english it could be `en`):

```ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {MaterialTranslateModule, TranslationLoaderService} from 'ngx-material-translate';
import {AppComponent} from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        MaterialTranslateModule.forRoot({
            loader: { provide: TranslationLoaderService, useFactory: (http: HttpClient) => new TranslationLoaderService(http), deps: [HttpClient] }
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

##### AoT

If you want to configure a custom `TranslationLoaderService` while using [AoT compilation](https://angular.io/docs/ts/latest/cookbook/aot-compiler.html) or [Ionic](http://ionic.io/), you must use an exported function instead of an inline function.

```ts
export function userTranslationLoader(http: HttpClient) {
    return new TranslationLoaderService(http);
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        MaterialTranslateModule.forRoot({
            loader: {
                provide: TranslationLoaderService,
                useFactory: (userTranslationLoader),
                deps: [HttpClient]
            }
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 2. Define the `default language` for the application

```ts
@NgModule({
    imports: [
        BrowserModule,
        MaterialTranslateModule.forRoot({
            defaultLanguage: LanguageCode.English
        })
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 3. Init the `LanguageService` and `TranslateService` for your application:

```ts
import {Component} from '@angular/core';
import {INTERNAL_FEATURE, LanguageCode, LanguageService, TranslateService} from 'ngx-material-translate';

@Component({
    selector: 'app',
    template: `
        <div>{{ 'HELLO' | translate }}</div>
    `
})
export class AppComponent {
    constructor(languageService: LanguageService, translateService: TranslateService) {
        languageService.business.selectLanguage(LanguageCode.English);

        //Listen for language change.
        languageService.model.activeLanguageCode$.subscribe(languageCode => {
          languageService.business.translateLanguages();


          //Loads the MatLanguageComponent label translations.
          translateService.business.loadTranslations(INTERNAL_FEATURE);
          //Loads the translations and sets to the custom feature feature.
          translateService.business.loadTranslations('feature');
          //Loads the translations and sets to the default feature 'app'.
          translateService.business.loadTranslations();
        });
    }
}
```

#### 4. Define the translations:

Once you've imported the `MaterialTranslateModule`, you can put your translations in a json file that will be imported with the `TranslationLoaderService`. The following translations should be stored in `en.json`.

```json
{
    "HELLO": "hello"
}
```

You can also define your translations manually with `addTranslations`.
Translations will be added to the selected language used.

```ts
translate.addTranslations({
    HELLO: 'hello'
});
```

You can then access the value by using the dot notation, in this case `HELLO`.

#### 5. Use the service, the pipe, the directive or the component:

You can either use the `LanguageService`, the `TranslateService`, the `TranslatePipe`, the `TranslateDirective` or the `MatLanguageComponent` to get your translation values or languages.

With the **service**, it looks like this:

```ts
let selectedLanguage = language.business.getActiveLanguage();

languageService.model.activeLanguage$.subscribe(language => {
  selectedLanguage = language;
});
```

```ts
let translation = translateService.business.getTranslation('app', 'hello');

translationService.model.languageTranslations('app').subscribe(translations => {
  translation = translations['hello']; 
});
```

This is how you do it with the **pipe** to display translation:

```html
<div>{{ 'HELLO' | translate }}</div>
```

This is how you use the **directive** to display translation:
```html
<div [translate]="'HELLO'"></div>
```

This is how you use the **component** to visualize languages:
```html
<mat-language></mat-language>
```

#### 6. Use HTML tags:

You can easily use raw HTML tags within your translations.

```json
{
    "HELLO": "<strong>Some html text</strong>"
}
```

To render them, simply use the `innerHTML` attribute with the pipe on any element.

```html
<div [innerHTML]="'HELLO' | translate"></div>
```
