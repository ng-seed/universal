import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2 } from 'angulartics2';
import { cold } from 'jasmine-marbles';

import { AnalyticsModule } from './analytics.module';
import { Analytics, AnalyticsService } from './analytics.service';

const MOCK_CATEGORY = 'category';

const testModuleConfig = () => {
  TestBed.configureTestingModule({
    imports: [RouterTestingModule, AnalyticsModule],
    providers: [Angulartics2, AnalyticsService]
  });
};

class TestAnalytics extends Analytics {}

describe('AnalyticsService', () => {
  beforeEach(() => {
    testModuleConfig();
  });

  test('should track', inject(
    [AnalyticsService, Angulartics2],
    (analyticsService: AnalyticsService, angulartics: Angulartics2) => {
      analyticsService.devMode(false);
      analyticsService.track('click', {
        category: 'TEST',
        label: 'Testing'
      });
      const actual = angulartics.eventTrack;
      const expected = cold('c', {
        c: {
          action: 'click',
          properties: {
            category: 'TEST',
            label: 'Testing'
          }
        }
      });

      expect(actual).toBeObservable(expected);
    }
  ));

  test('should pageTrack', inject(
    [AnalyticsService, Angulartics2],
    (analyticsService: AnalyticsService, angulartics: Angulartics2) => {
      analyticsService.devMode(false);
      analyticsService.pageTrack('/testing');
      const actual = angulartics.pageTrack;
      const expected = cold('c', {
        c: {
          path: '/testing'
        }
      });

      expect(actual).toBeObservable(expected);
    }
  ));

  test('should identify', inject(
    [AnalyticsService, Angulartics2],
    (analyticsService: AnalyticsService, angulartics: Angulartics2) => {
      analyticsService.devMode(false);
      analyticsService.identify({
        userId: 1,
        name: 'Test',
        email: 'name@domain.com'
      });
      const actual = angulartics.setUserProperties;
      const expected = cold('c', {
        c: {
          userId: 1,
          name: 'Test',
          email: 'name@domain.com'
        }
      });

      expect(actual).toBeObservable(expected);
    }
  ));
});

describe('AnalyticsService (base class)', () => {
  beforeEach(() => {
    testModuleConfig();
  });

  test('should allow descendants to track actions', inject([AnalyticsService], (analyticsService: AnalyticsService) => {
    const spyAnalytics = spyOn(analyticsService, 'track');
    const analytics = new TestAnalytics(analyticsService, MOCK_CATEGORY);
    analytics.track('action', {
      category: analytics.category,
      label: 'Testing'
    });

    expect(spyAnalytics).toHaveBeenCalledWith('action', {
      category: analytics.category,
      label: 'Testing'
    });
  }));
});
