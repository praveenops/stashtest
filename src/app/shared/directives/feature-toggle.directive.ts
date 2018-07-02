import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FEATURE } from '../../features';
import { APP_REDUCERS } from '../../_store/app-reducers';
import { DATA_STATE } from '../../_store/data-states';

@Directive({
  selector: '[ionFeatureToggle]'
})
export class FeatureToggleDirective implements OnInit, OnDestroy {
  private featureToggles = {};
  private featureToggleName = '';
  private featureToggleSubscription;
  private _hasView = false;

  constructor(
    private store: Store<any>,
    private viewRef: ViewContainerRef,
    private templateRef: TemplateRef<Object>,
  ) { }

  @Input()
  set ionFeatureToggle(featureToggleName) {
    this.featureToggleName = featureToggleName;
  }

  private toggleView() {
    if (!this.viewRef) {
      return;
    }

    const enableFeature = !this.featureToggleName || this.featureToggles[this.featureToggleName];

    if (enableFeature && !this._hasView) {
      this.viewRef.createEmbeddedView(this.templateRef);
      this._hasView = true;
    }  else if (!enableFeature && this._hasView) {
      this.viewRef.clear();
      this._hasView = false;
    }
  }

  ngOnInit() {
    this.featureToggleSubscription = this.store
      .pipe(
        select(s => s[FEATURE.APP]),
        select(s => s[APP_REDUCERS.APP_REDUCER]),
        select(s => s['featureToggles'])
      ).subscribe(featureToggles => {
        if (featureToggles.state !== DATA_STATE.RESOLVED) {
          return;
        }

        this.featureToggles = featureToggles.data || {};
        this.toggleView();
      });
  }

  ngOnDestroy() {
    this.featureToggleSubscription && this.featureToggleSubscription.unsubscribe();
  }
}
