import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from '.';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  compose(
    composeEnhancers(applyMiddleware(thunk)),
  ),
);

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept('.', () => {
      store.replaceReducer(reducers)
    })
  }
}

export default store;