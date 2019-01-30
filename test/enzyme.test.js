import {shallow, mount, render} from 'enzyme';
import WrappedApp, {WrappedApp2} from '../src/web/dummy.jsx';
import React from 'react';
import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars
import {IntlProvider as ReactIntlProvider} from 'react-intl';


describe('Enzyme', () => {
    it('calls componentDidMount', () => {
        // spy(WrappedApp.prototype, 'componentDidMount');
        const wrapper = mount(<ReactIntlProvider local='en'><WrappedApp2 year={1987}/></ReactIntlProvider>);
    });
});

