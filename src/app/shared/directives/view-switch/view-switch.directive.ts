import { ContentChildren, Directive, Input, QueryList, AfterViewInit } from '@angular/core';
import { ViewResolvingDirective } from './view-resolving.directive';
import { ViewResolvedDirective } from './view-resolved.directive';
import { ViewErrorDirective } from './view-error.directive';
import { ViewEmptyDirective } from './view-empty.directive';
import { DATA_STATE } from '../../../_store/data-states';
import { ViewInvalidDirective } from './view-invalid.directive';

@Directive({
  selector: '[ionViewSwitch]'
})
export class ViewSwitchDirective implements AfterViewInit {
  @ContentChildren(ViewResolvingDirective) resolving: QueryList<ViewResolvingDirective>;
  @ContentChildren(ViewErrorDirective) error: QueryList<ViewErrorDirective>;
  @ContentChildren(ViewResolvedDirective) resolved: QueryList<ViewResolvedDirective>;
  @ContentChildren(ViewEmptyDirective) empty: QueryList<ViewEmptyDirective>;
  @ContentChildren(ViewInvalidDirective) invalid: QueryList<ViewInvalidDirective>;

  constructor() { }

  private viewState: DATA_STATE = DATA_STATE.INITIAL;

  @Input()
  set ionViewSwitch(viewState) {
    this.viewState = viewState;
    this.setViewState();
  }

  ngAfterViewInit() {
    this.setViewState();
  }

  private setViewState() {
    setTimeout(() => {
      this.setResolving(this.viewState);
      this.setError(this.viewState);
      this.setResolved(this.viewState);
      this.setEmpty(this.viewState);
      this.setInvalid(this.viewState);
    }, 0);
  }

  private setResolving(viewState) {
    if (this.resolving) {
      this.resolving.forEach(l => {
        l.ionViewResolving = viewState === DATA_STATE.RESOLVING;
      });
    }
  }

  private setError(viewState) {
    if (this.error) {
      this.error.forEach(e => {
        e.ionViewError = viewState === DATA_STATE.ERROR;
      });
    }
  }

  private setResolved(viewState) {
    if (this.resolved) {
      this.resolved.forEach(c => {
        c.ionViewResolved = viewState === DATA_STATE.RESOLVED;
      });
    }
  }

  private setEmpty(viewState) {
    if (this.empty) {
      this.empty.forEach(f => {
        f.ionViewEmpty = viewState === DATA_STATE.EMPTY;
      });
    }
  }

  private setInvalid(viewState) {
    if (this.invalid) {
      this.invalid.forEach(f => {
        f.ionViewInvalid = viewState === DATA_STATE.INVALID;
      });
    }
  }
}
