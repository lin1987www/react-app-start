import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, applyMiddleware, compose} from 'react-redux';  // eslint-disable-line no-unused-vars
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from '../reducers';
import App from '../components/App.jsx';

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

const store = createStore(
    rootReducer,
    composeWithDevTools(
        // applyMiddleware(...middleware),
        // other store enhancers if any
    )
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);



