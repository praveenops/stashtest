import { OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subscription } from 'rxjs';

interface SubscriptionInput {
  store: Store<any>;
  feature: string;
  reducer: string;
  state?: string;
}

export class RootComponent implements OnDestroy {
  subscriptions: Subscription[] = [];

  subscribe(inputs: SubscriptionInput | any, onSuccess: any, onError?: any) {
    let subscription;
    if (Array.isArray(inputs)) {
      const subscribers = [];
      inputs.forEach(input => {
        let subscriber = input.store.
          pipe(
            select(s => s[input.feature]),
            select(s => s[input.reducer])
          );

        if (input.state) {
          subscriber = subscriber.pipe(
            select(s => s[input.state])
          );
        }
        subscribers.push(subscriber);
      });

      subscription = combineLatest(subscribers).subscribe(state => {
        try {
          onSuccess(state);
        } catch (ex) {
          onError && onError(ex);
        }
      }, onError);

      this.subscriptions.push(subscription);

    } else {
      let subscriber = inputs.store
        .pipe(
          select(s => s[inputs.feature]),
          select(s => s[inputs.reducer])
        );

      if (inputs.state) {
        subscriber = subscriber.pipe(
          select(s => s[inputs.state])
        );
      }

      subscription = subscriber.subscribe(state => {
        try {
          onSuccess(state);
        } catch (ex) {
          onError && onError(ex);
        }
      }, onError);
      this.subscriptions.push(subscription);
    }

    return subscription;

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription && subscription.unsubscribe());
    this.subscriptions = [];
  }
}
