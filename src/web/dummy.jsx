import React from 'react';
import ReactDOM from 'react-dom';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import {compose} from 'redux'; // eslint-disable-line no-unused-vars
import Greeting from '../components/Greeting.jsx';

const WrappedApp = compose(
    AppStateHOC
)(Greeting);

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
document.body.prepend(rootDiv);

ReactDOM.render(
    <WrappedApp data-name={'john'} data-text={'lin'} options={{}} name='World'/>,
    rootDiv
);

export {
    WrappedApp as default,
};