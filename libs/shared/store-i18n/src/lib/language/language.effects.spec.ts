import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsModule } from '@fulls1z3/shared/util-analytics';
import { CoreTestingModule } from '@fulls1z3/shared/util-core/testing';
import { I18NService } from '@fulls1z3/shared/util-i18n';
import { I18NTestingModule } from '@fulls1z3/shared/util-i18n/testing';
import { MockActions, StoreTestingModule } from '@fulls1z3/shared/util-store/testing';
import { Actions } from '@ngrx/effects';
import { ConfigService } from '@ngx-config/core';
import { cold, hot } from 'jasmine-marbles';

import { languageActions } from './language.actions';
import { LanguageEffects } from './language.effects';

const testModuleConfig = () => {
  TestBed.configureTestingModule({
    imports: [RouterTestingModule, AnalyticsModule, CoreTestingModule, StoreTestingModule, I18NTestingModule],
    providers: [LanguageEffects]
  });
};

describe('LanguageEffects', () => {
  beforeEach(() => {
    testModuleConfig();
  });

  test('should build without a problem', inject([LanguageEffects], (instance: LanguageEffects) => {
    expect(instance).toBeTruthy();
  }));

  describe('init$', () => {
    test('should dispatch `use` action', inject([LanguageEffects, ConfigService], (effects: LanguageEffects, config: ConfigService) => {
      const settings = config.getSettings('i18n');
      const defaultLanguage = settings.defaultLanguage;

      const action = languageActions.i18nInitLanguage(settings);
      const completion = languageActions.i18nUseLanguage(defaultLanguage.code);

      const actions$ = TestBed.inject(Actions);
      // tslint:disable-next-line
      (actions$ as MockActions).stream = hot('-a', { a: action });

      const actual = effects.init$;
      const expected = cold('-c', { c: completion });

      expect(actual).toBeObservable(expected);
    }));
  });

  describe('use$ w/o `init`', () => {
    test('should dispatch `useFail` action w/initial `Language`, on fail', inject([LanguageEffects], (effects: LanguageEffects) => {
      const unsupportedLanguageCode = 'xx';

      const action = languageActions.i18nUseLanguage(unsupportedLanguageCode);
      const completion = languageActions.i18nUseLanguageFail(unsupportedLanguageCode);

      const actions$ = TestBed.inject(Actions);
      // tslint:disable-next-line
      (actions$ as MockActions).stream = hot('-a', { a: action });

      const actual = effects.use$;
      const expected = cold('-c', { c: completion });

      expect(actual).toBeObservable(expected);
    }));
  });

  describe('use$', () => {
    test('should dispatch `useSuccess` action w/selected `Language`, on success', inject(
      [LanguageEffects, ConfigService, I18NService],
      (effects: LanguageEffects, config: ConfigService, i18n: I18NService) => {
        const settings = config.getSettings('i18n');
        const defaultLanguage = settings.defaultLanguage;

        i18n.defaultLanguage = defaultLanguage;
        i18n.availableLanguages = settings.availableLanguages;

        const action = languageActions.i18nUseLanguage(defaultLanguage.code);
        const completion = languageActions.i18nUseLanguageSuccess(defaultLanguage);

        const actions$ = TestBed.inject(Actions);
        // tslint:disable-next-line
        (actions$ as MockActions).stream = hot('-a', { a: action });

        const actual = effects.use$;
        const expected = cold('-c', { c: completion });

        expect(actual).toBeObservable(expected);
      }
    ));

    test('should dispatch `useSuccess` action w/default `Language`, on fail', inject(
      [LanguageEffects, ConfigService, I18NService],
      (effects: LanguageEffects, config: ConfigService, i18n: I18NService) => {
        const settings = config.getSettings('i18n');
        const defaultLanguage = settings.defaultLanguage;
        const unsupportedLanguageCode = 'xx';

        i18n.defaultLanguage = defaultLanguage;
        i18n.availableLanguages = settings.availableLanguages;

        const action = languageActions.i18nUseLanguage(unsupportedLanguageCode);
        const completion = languageActions.i18nUseLanguageSuccess(defaultLanguage);

        const actions$ = TestBed.inject(Actions);
        // tslint:disable-next-line
        (actions$ as MockActions).stream = hot('-a', { a: action });

        const actual = effects.use$;
        const expected = cold('-c', { c: completion });

        expect(actual).toBeObservable(expected);
      }
    ));
  });
});
