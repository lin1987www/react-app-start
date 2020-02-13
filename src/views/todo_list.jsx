import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux'; // eslint-disable-line no-unused-vars
import {Provider} from 'react-redux';  // eslint-disable-line no-unused-vars
import rootReducer from '../reducers';
import App from '../components/App.jsx';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        // applyMiddleware(...middleware),
        // other store enhancers if any
    )
);

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);



