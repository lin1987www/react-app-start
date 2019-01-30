import {assert, expect, should} from 'chai'; // eslint-disable-line no-unused-vars

describe('ES6', () => {
    describe('Destructuring assignment', () => {
        it('Array destructuring', () => {
            const array = [1, 2, 3, 4, 5];
            let a, b, c;
            [a, b, c] = array;
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.equal(c, 3);
            let cde;
            [a, b, ...cde] = array;
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.deepEqual(cde, [3, 4, 5]);
            let d, e, f;
            [, , , d, e = 15, f = 16] = array;
            assert.equal(d, 4);
            assert.equal(e, 5);
            assert.equal(f, 16);
        });
        it('Object destructuring', () => {
            const object = {a: 1, b: 2, c: 3, d: 4, e: 5};
            let a, b, c;
            ({a, b, c} = object);
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.equal(c, 3);
            let cde;
            ({a, b, ...cde} = object);
            assert.equal(a, 1);
            assert.equal(b, 2);
            assert.deepEqual(cde, {c: 3, d: 4, e: 5});
            let d, e, f;
            ({d, e = 15, f = 16} = object);
            assert.equal(d, 4);
            assert.equal(e, 5);
            assert.equal(f, 16);
            let aa, bb, ff;
            ({a: aa = 11, b: bb = 12, f: ff = 16} = object);
            assert.equal(aa, 1);
            assert.equal(bb, 2);
            assert.equal(ff, 16);
            let aaa;
            ({['a']: aaa = 111} = object);
            assert.equal(aaa, 1);
            const user = {
                id: 42,
                displayName: 'jdoe',
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            let {
                id: userId, // rename
                fullName: {
                    firstName: userFirstName,// rename
                }
            } = user;
            assert.equal(userId, user.id);
            assert.equal(userFirstName, user.fullName.firstName);
            const {id, ...restWithoutId} = user;
            assert.deepEqual(restWithoutId, {
                displayName: 'jdoe',
                fullName: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });
        });
    });
});