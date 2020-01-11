import { inject, TestBed } from '@angular/core/testing';
import { FlexModule } from '@angular/flex-layout';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AIRLINE, Airline, airlineActions } from '@fulls1z3/shared/store-air-universal';
import { MOCK_AIRLINE } from '@fulls1z3/shared/store-air-universal/testing';
import { MaterialModule } from '@fulls1z3/shared/ui-material';
import { CoreTestingModule } from '@fulls1z3/shared/util-core/testing';
import { I18NTestingModule } from '@fulls1z3/shared/util-i18n/testing';
import { getState, StoreTestingModule } from '@fulls1z3/shared/util-store/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { SharedModule } from '../../shared';
import { CommonModule } from '../../shared/common/common.module';
import { DataTableModule } from '../../shared/data-table';

import { AirlineComponent } from './airline.component';

configureTestSuite(() => {
  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      FlexModule,
      CoreTestingModule,
      I18NTestingModule,
      StoreTestingModule,
      MaterialModule,
      DataTableModule,
      CommonModule,
      SharedModule
    ],
    declarations: [AirlineComponent]
  });
});

describe('AirlineComponent', () => {
  test('should build without a problem', () => {
    const fixture = TestBed.createComponent(AirlineComponent);
    const instance = fixture.componentInstance;
    fixture.detectChanges();

    expect(instance).toBeTruthy();
  });

  test('should `getMany` from AirlineSelectors on init', () => {
    const fixture = TestBed.createComponent(AirlineComponent);
    const store$ = TestBed.get(Store);
    const state = getState<Airline>(AIRLINE, MOCK_AIRLINE);
    store$.setState(state);
    fixture.detectChanges();

    const actual = fixture.componentInstance.airlines$;
    const expected = cold('a', { a: [MOCK_AIRLINE] });

    expect(actual).toBeObservable(expected);
  });

  test('should dispatch `airUniversalGetManyAirlines` action on init', () => {
    const fixture = TestBed.createComponent(AirlineComponent);
    const store$ = fixture.debugElement.injector.get(Store);
    const spy = spyOn(store$, 'dispatch');
    fixture.detectChanges();

    const action = airlineActions.airUniversalGetManyAirlines();

    expect(spy).toHaveBeenCalledWith(action);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test(
    'should navigate to `create` on create button click',
    inject([Router], (router: Router) => {
      const fixture = TestBed.createComponent(AirlineComponent);
      const instance = fixture.componentInstance;
      const spy = spyOn(router, 'navigate');
      fixture.detectChanges();

      const menu = fixture.debugElement.query(By.css('.qa-menu'));
      menu.triggerEventHandler('click', {});
      const createButton = fixture.debugElement.query(By.css('.qa-menu_item__create'));
      createButton.triggerEventHandler('click', {});

      expect(spy).toHaveBeenCalledWith([...instance.baseRoute, 'create']);
      expect(spy).toHaveBeenCalledTimes(1);
    })
  );

  test('should dispatch `airUniversalGetManyAirlines` action on refresh button click', () => {
    const fixture = TestBed.createComponent(AirlineComponent);
    const store$ = fixture.debugElement.injector.get(Store);
    const spy = spyOn(store$, 'dispatch');
    fixture.detectChanges();

    const refreshButton = fixture.debugElement.query(By.css('button.qa-toolbar__refresh'));
    refreshButton.triggerEventHandler('click', {});

    const action = airlineActions.airUniversalGetManyAirlines();

    expect(spy).toHaveBeenCalledWith(action);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
