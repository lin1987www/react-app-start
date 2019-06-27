import {shallow, mount, render} from 'enzyme'; // eslint-disable-line no-unused-vars
import React from 'react';
import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars
import WrappedApp from '../src/web/hi_i18n.jsx';

// Only run under mocha(node)

describe('Enzyme', () => {
    it('calls componentDidMount', () => {
        // spy(WrappedApp.prototype, 'componentDidMount');
        const wrapper = mount(<WrappedApp name={'John'}/>); // eslint-disable-line no-unused-vars
    });
});

