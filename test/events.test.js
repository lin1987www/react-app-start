import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars
import EventEmitter from 'events';
// https://nodejs.org/docs/latest-v10.x/api/events.html

describe('events', () => {
    it('on', () => {
        const myEE = new EventEmitter();
        myEE.on('foo', () => {
        });
        myEE.on('bar', () => {
        });
        const sym = Symbol('symbol');
        myEE.on(sym, () => {
        });
        expect(myEE.eventNames()).to.deep.equal(['foo', 'bar', sym]);
    });
    it('emit on', () => {
        const myEE = new EventEmitter();
        let count = 0;
        const listener = (a, b, c) => {
            count++;
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.equal(c, 3);
        };
        myEE.on('plusOne', listener);
        myEE.emit('plusOne', 1, 2, 3);
        myEE.removeListener('plusOne', listener);
        myEE.emit('plusOne', 1, 2, 3);
        assert.equal(count, 1);
    });
    it('emit once', () => {
        const myEE = new EventEmitter();
        let count = 0;
        const listener = (a, b, c) => {
            count++;
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.equal(c, 3);
        };
        myEE.once('plusOne', listener);
        myEE.removeListener('plusOne', listener);
        myEE.emit('plusOne', 1, 2, 3);
        myEE.emit('plusOne', 1, 2, 3);
        assert.equal(count, 0);
    });
});
