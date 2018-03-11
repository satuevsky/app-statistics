import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {syncHistoryWithStore} from 'react-router-redux';
import history from './utils/history';
import store from './utils/store';

syncHistoryWithStore(history, store);

function render() {
    let App = require('./App').default;
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    );
}

if (module.hot) {
    module.hot.accept('./App', () => {
        render();
    })
}

render();