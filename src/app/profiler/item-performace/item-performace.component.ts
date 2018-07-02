import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FEATURE } from '../../features';
import { ActivatedRoute, Router } from '@angular/router';
import { NielsenColors } from 'ion-ui-components';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { DATA_STATE } from '../../_store/data-states';
import {
  convertDataItemPerformanceGap,
  convertDataItemPerformanceAverageSale,
  calculateScaleFactor
} from '../utils/dataTransformers';
import { ProfilerRootComponent } from '../profiler-root-component';
import { ProfilerContextService } from '../profiler-context-service';
import { take } from 'rxjs/internal/operators';

@Component({
  selector: 'ion-item-performance',
  templateUrl: './item-performace.component.html',
  styleUrls: ['./item-performace.component.scss']
})
export class ItemPerformaceComponent extends ProfilerRootComponent
  implements OnInit {
  itemPerformance: any = {
    state: 'INITIAL',
    gapdata: [],
    averagedata: [],
    error: 'Error fetching the data. Please try after sometime.'
  };
  titles: Array<string> = ['Total Items', 'Innovation Items'];
  leftChartColors: Array<string>;
  rightChartColors: Array<string> = [];
  errorCode: any;
  rowColor: String = '';
  gridColor: String = '';
  gridValues2: Array<number> = [0, 20, 40, 60, 80, 100];
  scalefactoravg: number;
  scalefactorgap: number;
  itemPerformanceConfig: any;
  constructor(
    store: Store<any>,
    private router: Router,
    private ref: ChangeDetectorRef, // TODO: refactor
    private colors: NielsenColors,
    private route: ActivatedRoute,
    profileContextService: ProfilerContextService
  ) {
    super(store, profileContextService);
    const reportColor = this.colors.getReportPalette();
    const nielsenPalette = this.colors.getNielsenPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.rightChartColors = [reportColor.lightpurple];
    this.leftChartColors = [reportColor.lightgold, reportColor.ultraLightBlue];
    const width = window.innerWidth * 0.34;
    this.scalefactoravg = calculateScaleFactor(width, 64);
    this.scalefactorgap = calculateScaleFactor(width, 34);
    this.itemPerformanceConfig = {
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: this.gridColor },
      textRightPadding: 10,
      toolTipWidth: 300,
      fixedbarHeight: 8
    };
  }

  @ViewChild('chartsection') chartsection: ElementRef;

  @HostListener('window:resize')
  onResize() {
    if (this.chartsection && this.chartsection.nativeElement) {
      const width = this.chartsection.nativeElement.getAttribute('width');
      this.scalefactoravg = calculateScaleFactor(width, 64);
      this.scalefactorgap = calculateScaleFactor(width, 34);
    }
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
        this.itemPerformanceSubscription(factShare);
      }
    );
  }

  private itemPerformanceSubscription(factShare) {
    if (!this.contextResolving) {
      this.dataState = factShare.state;
    }

    if (factShare.state === DATA_STATE.ERROR) {
      this.errorCode = factShare.message;
    }

    if (factShare.state === DATA_STATE.RESOLVED) {
      this.itemPerformance.gapdata = convertDataItemPerformanceGap(
        factShare.data
      );
      this.itemPerformance.averagedata = convertDataItemPerformanceAverageSale(
        factShare.data
      );
    }

    this.ref.detectChanges();
  }

  rowHandleClickAvg(data) {
    if (data.subtitle === 'CAT') {
      this.router.navigate([`CAT`, 'items'], { relativeTo: this.route });
    } else {
      const manufacturerOrBrandId = this.itemPerformance.averagedata
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

  rowHandleClickGap(data) {
    if (data.subtitle === 'CAT') {
      this.router.navigate([`CAT`, 'items'], { relativeTo: this.route });
    } else {
      const manufacturerOrBrandId = this.itemPerformance.gapdata
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

  /* generateGrid(lb, ub, numberOfGrids, rightOuterGridMax = 0) {
    const arr = [];
    ub = parseInt(ub + rightOuterGridMax, 10);
    const dist = ((ub - lb) / (numberOfGrids - 1));
    let interval = lb;
    while (interval < ub) {
      arr.push(parseInt(interval, 10));
      interval += dist;
    }
    arr.push(parseInt(interval, 10));
    return arr;
  } */

  /* getResponsiveNumberOfGrids(clientWidth = this.itemPerformanceElement.nativeElement.clientWidth) {
    if (clientWidth < 600) {
      return 4;
    } else if (clientWidth < 700) {
      return 5;
    } else if (clientWidth < 850) {
      return 6;
    } else {
      return 8;
    }
  } */
}
