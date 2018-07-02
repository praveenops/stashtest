import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FEATURE } from '../../features';
import { NielsenColors } from 'ion-ui-components';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { DATA_STATE } from '../../_store/data-states';
import {
  convertDataInnovationCharacteristics,
  calculateScaleFactor
} from '../utils/dataTransformers';
import { ProfilerRootComponent } from '../profiler-root-component';
import { ProfilerContextService } from '../profiler-context-service';
import { take } from 'rxjs/internal/operators';

@Component({
  selector: 'ion-innovation-characteristics',
  templateUrl: './innovation-characteristics.component.html',
  styleUrls: ['./innovation-characteristics.component.scss']
})
export class InnovationCharacteristicsComponent extends ProfilerRootComponent
  implements OnInit {
  CHARACTERISTIC_ABBR = 'CHR';

  errorCode: any;
  innovationCharacteristics: any = {
    state: 'INITIAL',
    data: [],
    error: 'Error fetching the data. Please try after sometime.'
  };
  columnArray: Array<any>;
  graphColors: any[] = [];
  rowColor: string;
  gridColor: string;
  scalefactor: number;
  noResultMessage = 'YOUR SELECTIONS RETURN NO RESULTS.';
  innovationCharacteristicsConfig: any;
  constructor(
    store: Store<any>,
    private ref: ChangeDetectorRef, // TODO: refactor
    private colors: NielsenColors,
    profilerContextService: ProfilerContextService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store, profilerContextService);
    const nielsenPalette = colors.getNielsenPalette();
    const reportPalette = colors.getReportPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.graphColors = [
      reportPalette.ultraLightRed,
      colors.getBarPalette().aqua
    ];
    this.scalefactor = calculateScaleFactor((window.innerWidth - 60) / 9, 24);
    this.innovationCharacteristicsConfig = {
      paddingTop: 60,
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: this.gridColor },
      textRightPadding: 10,
      headerPaddingBetween: 8,
      headerPaddingDown: 8,
      fixedbarHeight: 8,
      toolTipWidth: 300,
      rowColors: [this.rowColor]
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
              select(PROFILE_REDUCERS.INNOVATION_CHARACTERISTICS),
              select('innovationCharacteristics'),
              take(1)
            )
            .subscribe(factShare => {
              if (factShare.state === DATA_STATE.INITIAL) {
                this.store.dispatch({
                  type: PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS,
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
        reducer: PROFILE_REDUCERS.INNOVATION_CHARACTERISTICS,
        state: 'innovationCharacteristics'
      },
      profilerDataSet => {
        this.innovationCharacteristicsSubscription(profilerDataSet);
      }
    );
  }

  private innovationCharacteristicsSubscription(innovationCharacteristics) {
    if (!this.contextResolving) {
      this.dataState = innovationCharacteristics.state;
    }

    if (innovationCharacteristics.state === DATA_STATE.ERROR) {
      this.errorCode = innovationCharacteristics.message;
    }

    if (innovationCharacteristics.state === DATA_STATE.RESOLVED) {
      const innovationCharacteristicsData = convertDataInnovationCharacteristics(
        innovationCharacteristics.data
      );
      this.innovationCharacteristics.data = innovationCharacteristicsData.data;
      this.columnArray = innovationCharacteristicsData.columnArray;
    }

    this.ref.detectChanges();
  }

  rowHandleClick(data) {
    this.router.navigate([`${this.CHARACTERISTIC_ABBR}${data.id}`, 'items'], {
      relativeTo: this.route
    });
  }
}
