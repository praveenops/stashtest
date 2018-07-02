# ION-Innovation-Ui

Angular 4 based project.

## Development

```
yarn install
yarn start
``` 

## Working with ion-ui-components

1. clone ion-ui-components.
2. cd ion-ui-components
3. yarn link
4. cd ../ion-innovation-ui
5. yarn link ion-ui-components 

You should see local ui-component changes in the app.

**Note:**  There is an issue with node_modules and yarn link. Temporary solution is to rename node_modules to some other name.

## ngRx Implementation

 To understand ngRx and why do we need it - refer to [ngRx.md](ngRx.md)

## Working with ngRx

1. All the actions are mapped under 'APP_ACTIONS' object in store/app-actions.ts file. When you want to dispatch a new action make sure to include that in above file.
  
 Ex: To dispatch an action 'GET_DEMO_DATA' refer it with it's object 'APP_ACTIONS' mapped to type where store has dispatch method defined on it.
   
  ```
  store.dispatch({ type: APP_ACTIONS.GET_DEMO_DATA, payload: 123 })
  ```
  
  If there's any payload,it can be mentioned in the same object.
  
2.  Similarly states can be defined in store/app-states.ts file and effects in store/app-effects.ts.

3. Reducer names can be mapped in store/app-reducers.ts file which in turn uses store/reducers/app.reducer.ts file.

 * Any new reducer function name to be added has to be mapped in it's constants file (store/app-reducers.ts).
 
 * Reducer function implementation has to be done in store/reducers/app.reducer.ts file - where based on action type would modify state and return a new state.

**NOTE:** The above hierarchy structure is for general store at APP level. Similarly, we have a separate store for each module in their respective folders. The procedure of defining action, state and reducers remains same.
