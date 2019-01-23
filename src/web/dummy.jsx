import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux'; // eslint-disable-line no-unused-vars
import {Provider} from 'react-redux';  // eslint-disable-line no-unused-vars
import rootReducer from '../reducers';
import App from '../components/App.jsx';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const AppStateHOC = function (WrappedComponent) {
    class AppStateWrapper extends React.Component {
        constructor(props) {
            super(props);
            let initialState = {};
            let enhancer = composeEnhancers(
                // applyMiddleware(...middleware),
                // other store enhancers if any
            );
            const reducer = rootReducer;

            this.store = createStore(
                reducer,
                initialState,
                enhancer
            );
        }

        render() {
            const {
                isFullScreen, // eslint-disable-line no-unused-vars
                isPlayerOnly, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            return (
                <Provider store={this.store}>
                    <WrappedComponent {...componentProps} />
                </Provider>
            );
        }
    }

    AppStateWrapper.propTypes = {
        isFullScreen: PropTypes.bool,
        isPlayerOnly: PropTypes.bool
    };
    return AppStateWrapper;
};

const WrappedApp = compose(
    AppStateHOC
)(App);

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

ReactDOM.render(
    <WrappedApp data-name={'john'} data-text={'lin'} options={{}}/>,
    rootDiv);

export default WrappedApp;