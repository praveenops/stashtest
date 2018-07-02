## ngRx Documentation:

1. Why do we need ngRx? 

  * Managing state of application becomes tedious in complex SPA where multiple components use same copies of independent data.
  
 * Let's say we have 2 components which do not have parent-child relation. They rely on same data. We then use events to manage that data however, if we'll have to use several events using same copies of data and modifying it based on our requirements - this could be very confusing.
  
  * Also, we'll have to go back and forth to understand our code and it's flow.
  
To avoid this hassle, we use Redux way of implementation which is ngRx.
  
2. Building blocks of Redux:

 * Action - JS object used to dispatch an event to indicate something has happened say user click.
   
   It has a type property to indicate it's name and data (if we want to pass some data with action) like
  
   ```
   {type: 'INCREMENT', {counter: 0}}
   ```
   
 * Store : Single object that stores the state of the application.

 * Reducer: Function which specifies how to change the state based on action - it's like event handler. 

 NOTE: It doesn't modify the state and always return new state

  It accepts 2 params: state and action type as shown below
  
  ```
  function reducer(state, action) {
     //do something
  }
  ```
     
3. Data Flow:

 * When an event or action happens it's dispatched to store and then store passes the action to reducer - which looks at action type performs some operation and returns new state to store.
 * Thus, store updates it's state which would be used by the components in the app.

4. Redux implementation for angular can be done in 2 ways:

 * ngrx/store - we use this way
 * ng2-redux
 
To dig deeper into ngRx follow the below link:
 [https://gist.github.com/btroncone/a6e4347326749f938510](this)
