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
  convertDataInnovationContributing,
  calculateScaleFactor
} from '../utils/dataTransformers';
import { ProfilerRootComponent } from '../profiler-root-component';
import { ProfilerContextService } from '../profiler-context-service';

@Component({
  selector: 'ion-innovation-contribution',
  templateUrl: './innovation-contribution.component.html',
  styleUrls: ['./innovation-contribution.component.scss']
})
export class InnovationContributionComponent extends ProfilerRootComponent
  implements OnInit {
  chartColors: Array<string>;
  errorCode: any;
  innovationContributingToSales: any = {};
  rowColor: string;
  gridColor: string;
  columnArray: Array<any>;
  growthColors;
  legendColors;
  showLegend = true;
  legendTitle: string;
  scalefactor: number;
  innovationPlotConfig: any;
  @ViewChild('chartsection') chartsection: ElementRef;

  constructor(
    store: Store<any>,
    private ref: ChangeDetectorRef, // TODO: refactor
    private router: Router,
    private colorsN: NielsenColors,
    private route: ActivatedRoute,
    profileContextService: ProfilerContextService
  ) {
    super(store, profileContextService);
    const nielsenPalette = colorsN.getNielsenPalette();
    const reportPalette = colorsN.getReportPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.chartColors = ['', '', reportPalette.lightgreen];
    this.growthColors = [
      nielsenPalette.green500,
      nielsenPalette.red500,
      nielsenPalette.gray400
    ];
    this.legendColors = [nielsenPalette.green500, nielsenPalette.red500];
    this.legendTitle = 'Change vs. year ago (IN POINTS OF PERCENTAGE)';
    this.columnArray = [
      {
        name: 'Total Sales',
        shortName: 'Total Sales',
        colWidth: 2 / 15,
        colWidthMob: 3.5 / 12,
        textAlign: 'right',
        numberFormat: true,
        millionFormat: true
      },
      {
        name: 'Innovation Sales',
        shortName: 'Innovation Sales',
        colWidth: 2 / 15,
        colWidthMob: 3.5 / 12,
        textAlign: 'right',
        numberFormat: true,
        millionFormat: true
      },
      {
        name: 'Amount of Sales from Innovation',
        shortName: 'Amount of Sales from Innovation',
        colWidth: 11 / 15,
        colWidthMob: 5 / 12,
        multipleGrids: 5
      }
    ];

    this.innovationPlotConfig = {
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: '#D5D7DB' },
      chartColors: [reportPalette.lightgreen],
      titleFont: {
        size: '11px',
        'font-weight': 100
      }
    };
    // Considering both the sections 2/3 of section ends up to be 0.76 of the current width
    // Calculation method - added id for section and on resize computed value and divide by total width
    const width = window.innerWidth * 0.76;
    /*
      Since the graph has a breakpoint at 511.5 px (manually calculating) we have 2 versions of graph scale
      1st equal width column and higher occupancy column, considering 5 as base for equal width column and
      text width to be of fontsize 34px (42px considering single decimal) by trail and error got to
      factor of 2.36 to have graph size and text widthin width
    */
    this.scalefactor = calculateScaleFactor(
      width / (width > 511.5 ? 1.3 : 2),
      132
    );
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
      const width = this.chartsection.nativeElement.getAttribute('width');
      this.scalefactor = calculateScaleFactor(
        width / (width > 511.5 ? 1.3 : 2),
        132
      );
    }
  }

  private marketShareSubscription(factShare) {
    if (!this.contextResolving) {
      this.dataState = factShare.state;
    }

    if (factShare.state === DATA_STATE.ERROR) {
      this.errorCode = factShare.message;
    }

    if (factShare.state === DATA_STATE.RESOLVED) {
      this.innovationContributingToSales.data = convertDataInnovationContributing(
        factShare.data
      );
    }

    this.ref.detectChanges();
  }

  rowHandleClick(data) {
    if (data.data.subtitle === 'CAT') {
      this.router.navigate([`${data.data.subtitle}`, 'items'], {
        relativeTo: this.route
      });
    } else {
      const manufacturerOrBrandId = this.innovationContributingToSales.data
        .filter(o => o.id && data.data.id && data.data.id === o.id)
        .map(o => o.id)
        .shift();
      if (manufacturerOrBrandId) {
        this.router.navigate(
          [`${data.data.subtitle}${manufacturerOrBrandId}`, 'items'],
          { relativeTo: this.route }
        );
      }
    }
  }

  /**
   * TO DO : Uncomment this function after requirement confirmation about refactored code
   */
  // rowHandleClick1(rowInfo) {
  //   let data = this.innovationContributingToSales.data[rowInfo.rowIndex];
  //   if (data.subtitle === 'CAT') {
  //     this.router.navigate([`${data.subtitle}`, 'items'], {
  //       relativeTo: this.route
  //     });
  //   } else {
  //     const manufacturerOrBrandId = this.innovationContributingToSales.data
  //       .filter(o => o.id && data.id && data.id === o.id)
  //       .map(o => o.id)
  //       .shift();
  //     if (manufacturerOrBrandId) {
  //       this.router.navigate(
  //         [`${data.subtitle}${manufacturerOrBrandId}`, 'items'],
  //         { relativeTo: this.route }
  //       );
  //     }
  //   }
  // }
}
