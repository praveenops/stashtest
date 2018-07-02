import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { NielsenColors } from 'ion-ui-components';
import { FEATURE } from '../../features';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { DATA_STATE } from '../../_store/data-states';
import {
  convertDataColumnType,
  calculateScaleFactor
} from '../utils/dataTransformers';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilerRootComponent } from '../profiler-root-component';
import { ProfilerContextService } from '../profiler-context-service';
import { take } from 'rxjs/internal/operators';

@Component({
  selector: 'ion-lx-sub-types',
  templateUrl: './lx-sub-types.component.html',
  styleUrls: ['./lx-sub-types.component.scss']
})
export class LxSubTypesComponent extends ProfilerRootComponent
  implements OnInit {
  columnArray: any = [];
  graphColors: any[] = [];
  rowColor: string;
  gridColor: string;
  errorCode: any;
  lxSubtypes: any = {
    data: []
  };
  scalefactor: number;
  noResultMessage = 'YOUR SELECTIONS RETURN NO RESULTS.';
  lxSubTypeConfig: any;
  @ViewChild('chartsection') chartsection: ElementRef;

  constructor(
    store: Store<any>,
    private router: Router,
    private ref: ChangeDetectorRef, // TODO: refactor
    private colors: NielsenColors,
    private route: ActivatedRoute,
    profilerContextService: ProfilerContextService
  ) {
    super(store, profilerContextService);
    const nielsenPalette = colors.getNielsenPalette();
    const reportPalette = colors.getReportPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.graphColors = [
      reportPalette.pink,
      reportPalette.aqua,
      reportPalette.lightpurple,
      reportPalette.orange,
      reportPalette.lightaqua,
      reportPalette.lightgreen,
      reportPalette.lightred,
      reportPalette.lightblue,
      reportPalette.gold
    ];
    this.scalefactor = calculateScaleFactor(
      (window.innerWidth - 60) / 13.2,
      28
    );
    this.lxSubTypeConfig = {
      paddingTop: 40,
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: this.gridColor },
      textRightPadding: 10,
      toolTipWidth: 300,
      headerPaddingBetween: 8,
      headerPaddingDown: 8,
      fixedbarHeight: 8
    };
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
              select(PROFILE_REDUCERS.LX_SUBTYPES),
              select('lxSubtypes'),
              take(1)
            )
            .subscribe(lxSubtypes => {
              if (lxSubtypes.state === DATA_STATE.INITIAL) {
                this.store.dispatch({
                  type: PROFILER_ACTIONS.GET_LX_SUBTYPES,
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
        reducer: PROFILE_REDUCERS.LX_SUBTYPES,
        state: 'lxSubtypes'
      },
      lxSubtypes => {
        this.lxSubtypesSubscription(lxSubtypes);
      }
    );
  }

  @HostListener('window:resize')
  onResize() {
    if (this.chartsection && this.chartsection.nativeElement) {
      this.scalefactor = calculateScaleFactor(
        this.chartsection.nativeElement.getAttribute('width') / 11.2,
        28
      );
    }
  }

  private lxSubtypesSubscription(lxSubtypes) {
    if (!this.contextResolving) {
      this.dataState = lxSubtypes.state;
    }
    if (lxSubtypes.state === DATA_STATE.RESOLVED) {
      const { result, columnArray } = convertDataColumnType(
        lxSubtypes.data,
        'innovationSubTypes'
      );
      this.columnArray = columnArray;
      const filteredColArray = columnArray.filter(
        value => value.name === 'Subline'
      );
      if (!filteredColArray.length) {
        this.graphColors.splice(6, 1);
      }
      this.lxSubtypes.data = result;
    } else if (lxSubtypes.state === DATA_STATE.ERROR) {
      this.errorCode = lxSubtypes.error;
    }
    this.ref.detectChanges();
  }

  handleClick(data) {
    if (data.subtitle === 'CAT') {
      this.router.navigate([`${data.subtitle}`, 'items'], {
        relativeTo: this.route
      });
    } else {
      const manufacturerOrBrandId = this.lxSubtypes.data
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
