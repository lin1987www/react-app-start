import {shallow, mount, render} from 'enzyme';
import WrappedApp from '../src/web/dummy.jsx';
import React from 'react';
import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars
import { spy } from 'sinon';

describe('Enzyme', () => {
    it('calls componentDidMount', () => {
        // spy(WrappedApp.prototype, 'componentDidMount');
        const wrapper = mount(<WrappedApp year={1987}/>);
    });
});

