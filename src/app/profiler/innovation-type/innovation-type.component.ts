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
  selector: 'ion-innovation-type',
  templateUrl: './innovation-type.component.html',
  styleUrls: ['./innovation-type.component.scss']
})
export class InnovationTypeComponent extends ProfilerRootComponent
  implements OnInit {
  columnArray: any = [];
  graphColors: any[] = [];
  rowColor: string;
  gridColor: string;
  errorCode: any;
  innovationType: any = {
    data: []
  };
  scalefactor: number;
  innovationTypeConfig: any;

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
    const barPalette = colors.getBarPalette();
    this.rowColor = nielsenPalette.gray50;
    this.gridColor = nielsenPalette.gray300;
    this.graphColors = [
      barPalette.blue,
      barPalette.purple,
      barPalette.green,
      barPalette.aqua,
      barPalette.magenta
    ];
    this.scalefactor = calculateScaleFactor((window.innerWidth - 60) / 9, 24);
    this.innovationTypeConfig = {
      paddingTop: 40,
      fixedRowHeight: 64,
      borderRight: [0, 1, 0, 0],
      xaxisStroke: { color: this.gridColor },
      textRightPadding: 10,
      fixedbarHeight: 8,
      headerPaddingBetween: 8,
      headerPaddingDown: 10,
      toolTipWidth: 300
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
              select(PROFILE_REDUCERS.INNOVATION_TYPE),
              select('innovationType'),
              take(1)
            )
            .subscribe(innovationType => {
              if (innovationType.state === DATA_STATE.INITIAL) {
                this.store.dispatch({
                  type: PROFILER_ACTIONS.GET_INNOVATION_TYPE,
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
        reducer: PROFILE_REDUCERS.INNOVATION_TYPE,
        state: 'innovationType'
      },
      innovationType => {
        this.innovationTypeSubscription(innovationType);
      }
    );
  }

  @HostListener('window:resize')
  onResize() {
    if (this.chartsection && this.chartsection.nativeElement) {
      this.scalefactor = calculateScaleFactor(
        this.chartsection.nativeElement.getAttribute('width') / 7,
        24
      );
    }
  }

  private innovationTypeSubscription(innovationType) {
    if (!this.contextResolving) {
      this.dataState = innovationType.state;
    }

    if (innovationType.state === DATA_STATE.ERROR) {
      this.errorCode = innovationType.errorCode;
    }

    if (innovationType.state === DATA_STATE.RESOLVED) {
      const { result, columnArray } = convertDataColumnType(
        innovationType.data,
        'innovationTypes'
      );
      this.columnArray = columnArray;
      this.innovationType.data = result;
    }
    this.ref.detectChanges();
  }

  handleClick(data) {
    if (data.subtitle === 'CAT') {
      this.router.navigate([`${data.subtitle}`, 'items'], {
        relativeTo: this.route
      });
    } else {
      const manufacturerOrBrandId = this.innovationType.data
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
