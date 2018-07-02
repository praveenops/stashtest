import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FEATURE } from '../../features';
import { ActivatedRoute, Router } from '@angular/router';
import { NielsenColors } from 'ion-ui-components';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { DATA_STATE } from '../../_store/data-states';
import {
  convertDataMarketInnovationShare,
  convertDataInnovationToMarket,
  calculateScaleFactor
} from '../utils/dataTransformers';
import { ProfilerContextService } from '../profiler-context-service';
import { ProfilerRootComponent } from '../profiler-root-component';

@Component({
  selector: 'ion-market-share',
  templateUrl: './market-share.component.html',
  styleUrls: ['./market-share.component.scss']
})
export class MarketShareComponent extends ProfilerRootComponent
  implements OnInit {
  leftChartColors: Array<string>; // old ['#FD7E7F', '#1DAFEC'];  new ['#cc7788', '#7799bb']
  rightChartColors: Array<string>;
  titles: Array<string> = ['Market Share', 'Innovation Share'];
  errorCode: any;
  marketShareAndInnovationShare: any = [];
  shareOfInnovationComparedToShareOfMarket: any = [];
  gridValues: Array<number> = [0, 16.667, 33.33, 50, 66.667, 83.333, 100];
  gridValues1: Array<number> = [50];
  gridValues2: Array<number> = [0, 20, 40, 60, 80, 100];
  rowColor: string;
  gridColor: string;
  centerAxisColor: string;
  scalefactor: number;
  marketShareConfig: any;
  shareOfInnoConig: any;

  @ViewChild('chartsection') chartsection: ElementRef;

  constructor(
    store: Store<any>,
    private router: Router,
    private ref: ChangeDetectorRef,
    private colorsN: NielsenColors,
    private route: ActivatedRoute,
    profileContextService: ProfilerContextService
  ) {
    super(store, profileContextService);
    const nielsenPalette = colorsN.getNielsenPalette();
    const reportPalette = colorsN.getReportPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.centerAxisColor = nielsenPalette.gray700;
    this.leftChartColors = [reportPalette.lightaqua, reportPalette.lightpurple];
    this.rightChartColors = [reportPalette.lightgreen];
    const width = window.innerWidth * 0.34;
    this.scalefactor = calculateScaleFactor(width, 42);
    this.marketShareConfig = {
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: this.gridColor },
      textRightPadding: 10,
      fixedbarHeight: 8,
      toolTipWidth: 300
    };
    this.shareOfInnoConig = {
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: this.gridColor },
      fixedbarHeight: 8,
      toolTipWidth: 300
    };
  }

  ngOnInit() {
    super.ngOnInit();

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
      this.scalefactor = calculateScaleFactor(
        this.chartsection.nativeElement.getAttribute('width'),
        42
      );
    }
  }

  private marketShareSubscription(factShare) {
    if (!this.contextResolving) {
      this.dataState = factShare.state;
    }

    if (factShare.state === DATA_STATE.ERROR) {
      this.errorCode = factShare.message;
    } else if (factShare.state === DATA_STATE.RESOLVED) {
      this.marketShareAndInnovationShare.data = convertDataMarketInnovationShare(
        factShare.data
      );
      this.shareOfInnovationComparedToShareOfMarket.data = convertDataInnovationToMarket(
        factShare.data
      );
    }

    this.ref.detectChanges();
  }

  rowHandleClick(data) {
    if (data.subtitle.indexOf('CAT') > -1) {
      this.router.navigate([`CAT`, 'items'], { relativeTo: this.route });
    } else {
      const manufacturerOrBrandId = this.marketShareAndInnovationShare.data
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
}
