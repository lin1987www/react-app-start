const chai = require('chai');
const {assert, expect, should} = chai; // eslint-disable-line no-unused-vars

describe('AMD', () => {
    it('Import', (done) => {
        // building webpack only work in webpack version '4.28.x'
        // If run under mocha(node), we need add 'babel-plugin-dynamic-import-node' plugin
        function dynamicImport() {
            import(
                /* webpackChunkName: "foo" */
                './foo'
            ).then(result => {
                expect(result.default).to.deep.equal('foo');
                import(
                    /* webpackChunkName: "bar" */
                    './bar'
                ).then(result => {
                    expect(result.default).to.deep.equal('bar');
                    expect(result.a).to.deep.equal('A');
                    expect(result.b).to.deep.equal('B');
                    done();
                });
            });
        }

        dynamicImport();
    });
});