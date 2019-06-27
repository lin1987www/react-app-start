const {assert, expect, should} = require('chai');
const TextEncoder = require('text-encoding').TextEncoder;

describe('TextEncoder', function () {
    function uint8ArrayToArray(uint8Array) {
        return Array.prototype.slice.call(uint8Array);
    }

    function numberToBinary(number) {
        return (number).toString(2);
    }

    function numberToHex(number) {
        const result = number.toString(16).toUpperCase();
        return result;
    }

    const copyrightSymbol = '©';
    const copyrightSymbolUnicode = 169;
    const copyrightSymbolUnicodeHex = 'A9';
    const copyrightSymbolUnicodeBin = '10101001';

    const highHeelSymbol = '👠';
    const highHeelSymbolUnicode = 128096;
    const highHeelSymbolUnicodeHex = '1F460';
    const highHeelSymbolUnicodeBin = '11111010001100000';
    const minHighSurrogateUnicode = parseInt('D800', 16);
    const maxLowSurrogateUnicode = parseInt('DFFF', 16);

    it('Unicode Copyright Symbol', function () {
        // https://en.wikipedia.org/wiki/Unicode
        // Normally, a Unicode code point is referred to by writing "U+" followed by its hexadecimal number.
        //
        // In Javascript
        // "\uXXXX" is for 4 hex digits Unicode             ex: String.prototype.charCodeAt, String.fromCharCode
        // "\u{XXXXX}" is for over 4 hex digits Unicode     ex: String.prototype.codePointAt, String.fromCodePoint

        // Both charCodeAt and fromCharCode only work in [U+0000 - U+FFFF], if over the range it will have problem.
        const code = copyrightSymbol.charCodeAt(0);
        const char = String.fromCharCode(code);
        assert.equal(copyrightSymbol, char);
        assert.equal(copyrightSymbolUnicode, code);
        assert.equal(copyrightSymbolUnicodeHex, numberToHex(copyrightSymbolUnicode));
        assert.equal(copyrightSymbolUnicodeBin, numberToBinary(copyrightSymbolUnicode));
    });

    it('Unicode High Heel Symbol', function () {
        assert.equal(highHeelSymbolUnicodeBin, numberToBinary(highHeelSymbolUnicode));

        const code = highHeelSymbol.charCodeAt(0);
        // Notice charCodeAt only support 4 hex digits, if over 4 hex digits it will be in a range [U+D800-U+DFFF]
        assert.equal(true, code > minHighSurrogateUnicode);
        assert.equal(true, code < maxLowSurrogateUnicode);
        // The exactly value is preserve 6 bits that start from 4th hex digit ( So AND 0xFC00 ), then OR 0xD800
        assert.equal((code).toString(16), ((highHeelSymbolUnicode & 0xFC00) >>> 10 | 0xD800).toString(16));

        // Notice fromCharCode only support 4 hex digits, if over 4 hex digits it will be cut off
        assert.equal(
            String.fromCharCode(parseInt(highHeelSymbolUnicodeHex.substring(highHeelSymbolUnicodeHex.length - 4), 16)),
            String.fromCharCode(highHeelSymbolUnicode)
        );

        // If over 4 hex digits using fromCodePoint
        const char = String.fromCodePoint(highHeelSymbolUnicode);
        assert.equal(highHeelSymbol, char);
        assert.equal(char.codePointAt(0), highHeelSymbolUnicode);
    });

    it('UTF8', function () {
        const encoder = new TextEncoder();
        // https://en.wikipedia.org/wiki/UTF-8
        //
        // 1 byte   7 bits   [U+0000 - U+007F] => [0000 0000 - 0111 1111] (2^7)-1+1 = 128 ( ASCII )
        //      [0xxx xxxx] => [0xxx xxxx] (00-7F)
        //
        // 2 bytes  11 bits  [U+0080 - U+07FF] => [0000 1000 0000 - 0111 1111 1111] (2^11)-1+1-(2^7) = 1920
        //      [0xxx xxxx xxxx] => [110x xxxx] (C0-DF)  [10xx xxxx] (80-BF)
        //
        // 3 bytes  16 bits  [U+0800 - U+FFFF] => [0000 1000 0000 0000 - 1111 1111 1111 1111] (2^16)-1+1-(2^11) = 63,488
        //      but [D800-DFFF] they are reserved for UTF-16 surrogate halves
        //      [D800-DFFF] => [1101 1xxx xxxx xxxx] (2^11)-1+1 = 2,048
        //      63,488 - 2,048 = 61,440
        //      [xxxx xxxx xxxx xxxx] => [1110 xxxx] [10xx xxxx] [10xx xxxx]
        //
        // 4 bytes  21 bits  [U+10000 - U+10FFFF] => [0000 0001 0000 0000 0000 0000 - 0001 0000 1111 1111 1111 1111]
        //      (16-1+1) * (2^16) = 1,048,576
        //      The result can split this equation [0x01 - 0x10] * [0x0000 - 0xFFFF]
        //      [000x xxxx xxxx xxxx xxxx xxxx] => [1111 0xxx] [10xx xxxx] [10xx xxxx] [10xx xxxx]
        //
        const utf8CopyrightSymbol = encoder.encode(copyrightSymbol);
        // copyrightSymbol = A9 = [000 1010 1001] UTF8 using 2 bytes encoding with it
        // [110x xxxx] apply to [000 10], [10xx xxxx] apply to [10 1001]
        // result [1100 0010] [1010 1001] => [C2] [A9]
        const utf8HexCopyrightSymbol = uint8ArrayToArray(utf8CopyrightSymbol).map(numberToHex);
        expect(utf8HexCopyrightSymbol).to.deep.equal(['C2', 'A9']);
        //
        const utf8HighHeelSymbol = encoder.encode(highHeelSymbol);
        // highHeelSymbol = 1F460 = [1 1111 0100 0110 0000]
        // apply to [1111 0xxx] [10xx xxxx] [10xx xxxx] [10xx xxxx]
        // [1111 0000] [1001 1111] [1001 0001] [1010 0000] => [F0] [9F] [91] [A0]
        const utf8HexHighHeelSymbol = uint8ArrayToArray(utf8HighHeelSymbol).map(numberToHex);
        expect(utf8HexHighHeelSymbol).to.deep.equal(['F0', '9F', '91', 'A0']);
    });
});