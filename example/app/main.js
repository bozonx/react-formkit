import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Home from './Home';


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(Home);

if (module.hot) {
  module.hot.accept('./Home', () => {
    const newApp = require('./Home').default;
    render(newApp);
  });
}
