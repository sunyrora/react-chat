import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './redux/reduxStore';

import { AppContainer } from 'react-hot-loader';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
}

const MainApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
render(MainApp);

if(module.hot) {
  module.hot.accept('./App', ()=>{render(MainApp)})
}

registerServiceWorker();
