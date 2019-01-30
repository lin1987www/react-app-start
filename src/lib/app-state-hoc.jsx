import React from 'react';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'; // eslint-disable-line no-unused-vars
import {Provider} from 'react-redux';  // eslint-disable-line no-unused-vars
import ConnectedIntlProvider from './connected-intl-provider';
import localesReducer, {localesInitialState} from '../reducers/locales';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const AppStateHOC = function (WrappedComponent) {
    class AppStateWrapper extends React.Component {
        constructor(props) {
            super(props);

            const reducers = {
                locales: localesReducer,
            };

            let initialState = {
                locales: localesInitialState,
            };

            let enhancer = composeEnhancers(
                // applyMiddleware(...middleware),
                // other store enhancers if any
            );

            const reducer = combineReducers(reducers);
            this.store = createStore(
                reducer,
                initialState,
                enhancer
            );
        }

        render() {
            const {
                ...componentProps
            } = this.props;
            return (
                <Provider store={this.store}>
                    <ConnectedIntlProvider>
                        <WrappedComponent {...componentProps} />
                    </ConnectedIntlProvider>
                </Provider>
            );
        }
    }

    return AppStateWrapper;
};

export default AppStateHOC;