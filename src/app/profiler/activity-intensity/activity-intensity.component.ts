import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FEATURE } from '../../features';
import { ActivatedRoute, Router } from '@angular/router';
import { NielsenColors } from 'ion-ui-components';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { DATA_STATE } from '../../_store/data-states';
import {
  convertDataActivityIntensity,
  calculateScaleFactor
} from '../utils/dataTransformers';
import { ProfilerRootComponent } from '../profiler-root-component';
import { ProfilerContextService } from '../profiler-context-service';
import { take } from 'rxjs/internal/operators';

@Component({
  selector: 'ion-activity-intensity',
  templateUrl: './activity-intensity.component.html',
  styleUrls: ['./activity-intensity.component.scss']
})
export class ActivityIntensityComponent extends ProfilerRootComponent
  implements OnInit {
  chartColors: Array<any>;
  dataState: string = DATA_STATE.INITIAL;
  legendTitles: Array<string> = [
    'Share of Total Items',
    'Share of Innovation Items'
  ];
  errorCode: any;
  marketShareActivityIntensity: any = {};
  rowColor: string;
  gridColor: string;
  columnArray: Array<any>;
  scalefactor: number;
  activityIntensityConfig: any;

  @ViewChild('chartsection') chartsection: ElementRef;

  constructor(
    store: Store<any>,
    private ref: ChangeDetectorRef, // TODO: refactor
    private router: Router,
    private colorsN: NielsenColors,
    private route: ActivatedRoute,
    profilerContextService: ProfilerContextService
  ) {
    super(store, profilerContextService);
    const nielsenPalette = colorsN.getNielsenPalette();
    const reportPalette = colorsN.getReportPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.chartColors = [
      '',
      '',
      [reportPalette.lightpink, reportPalette.ultraLightRed]
    ];
    this.columnArray = [
      {
        name: 'Total Items',
        shortName: 'Total Items',
        colWidth: 2 / 15,
        colWidthMob: 2.5 / 12,
        textAlign: 'right',
        numberFormat: true
      },
      {
        name: 'Innovation Items',
        shortName: 'Innovation Items',
        colWidth: 2 / 15,
        colWidthMob: 2.5 / 12,
        textAlign: 'right',
        numberFormat: true
      },
      {
        name: 'Share of Items Count',
        shortName: 'Share of Items Count',
        colWidth: 11 / 15,
        colWidthMob: 7 / 12,
        multipleGrids: 5
      }
    ];
    this.activityIntensityConfig = {
      paddingTop: 50,
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: '#D5D7DB' },
      titleFont: {
        size: '11px',
        'font-weight': 100
      },
      chartColors: [reportPalette.lightpink, reportPalette.ultraLightRed],
      tickValues: [20, 40, 60, 80],
      textRightPadding: 10,
      headerPaddingDown: 20,
      fixedbarHeight: 8,
      paddingHorizontal: 8,
      toolTipWidth: 300,
      flex: {
        titles: 1.9,
        totalItems: 0.75,
        innovationItems: 0.75,
        shareOfItemsCount: 4
      }
    };

    const width = window.innerWidth * 0.76;
    this.scalefactor = calculateScaleFactor(
      width / (width > 511.5 ? 2.36 : 5.2),
      28
    );
    this.responsiveWidthCalc(width);
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribe(
      {
        store: this.store,
        feature: FEATURE.PROFILER,
        reducer: PROFILE_REDUCERS.PROFILER,
        state: 'contextId'
      },
      contextId => {
        if (contextId.state === DATA_STATE.RESOLVED) {
          this.store
            .pipe(
              select(FEATURE.PROFILER),
              select(PROFILE_REDUCERS.MARKET_SHARE),
              select('factShare'),
              take(1)
            )
            .subscribe(factShare => {
              if (factShare.state === DATA_STATE.INITIAL) {
                this.store.dispatch({
                  type: PROFILER_ACTIONS.GET_MARKET_SHARE,
                  payload: {
                    queryParams: { contextId: contextId.data }
                  }
                });
              }
            });
        }
      }
    );

    super.subscribe(
      {
        store: this.store,
        feature: FEATURE.PROFILER,
        reducer: PROFILE_REDUCERS.MARKET_SHARE,
        state: 'factShare'
      },
      factShare => {
        this.marketShareSubscription(factShare);
      }
    );
  }

  @HostListener('window:resize')
  onResize() {
    if (this.chartsection && this.chartsection.nativeElement) {
      const width = this.chartsection.nativeElement.getAttribute('width');
      this.scalefactor = calculateScaleFactor(
        width / (width > 511.5 ? 2.36 : 5.2),
        28
      );
    }
    const windowWidth = window.innerWidth * 0.76;
    this.responsiveWidthCalc(windowWidth);
  }

  private marketShareSubscription(factShare) {
    if (!this.contextResolving) {
      this.dataState = factShare.state;
    }

    if (factShare.state === DATA_STATE.RESOLVED) {
      this.marketShareActivityIntensity.data = convertDataActivityIntensity(
        factShare.data
      );
    } else if (factShare.state === DATA_STATE.ERROR) {
      this.errorCode = factShare.message;
    }

    this.ref.detectChanges();
  }

  rowHandleClick(data) {
    if (data.subtitle.indexOf('CAT') > -1) {
      this.router.navigate([`CAT`, 'items'], { relativeTo: this.route });
    } else {
      const manufacturerOrBrandId = this.marketShareActivityIntensity.data
        .filter(o => o.id && data.id && data.id === o.id)
        .map(o => o.id)
        .shift();
      if (manufacturerOrBrandId) {
        this.router.navigate(
          [`${data.subtitle}${manufacturerOrBrandId}`, 'items'],
          { relativeTo: this.route }
        );
      }
    }
  }

  responsiveWidthCalc(width) {
    if (width >= 511.5) {
      this.activityIntensityConfig.flex = {
        titles: 1.9,
        totalItems: 0.75,
        innovationItems: 0.75,
        shareOfItemsCount: 4
      };
      this.activityIntensityConfig.tickValues = [20, 40, 60, 80];
    } else {
      this.activityIntensityConfig.flex = {
        titles: 2.2,
        totalItems: 1.5,
        innovationItems: 1.5,
        shareOfItemsCount: 4
      };
      this.activityIntensityConfig.tickValues = [];
    }
  }
}
