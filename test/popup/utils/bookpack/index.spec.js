import assert from 'assert';

import {
  prefixer,
  uriComponent,
  format,
  newlines
} from '../../../../src/utils/bookpack';

describe('Bookpack', () => {
  describe('prefixer', () => {
    describe('pack', () => {
      it('adds prefix to start of string', () => {
        const expectedOutput = 'javascript:(function() { alert("Hey!") })();';
        const input = '(function() { alert("Hey!") })();';

        const output = prefixer().pack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not add prefix if one exists at start of string', () => {
        const expectedOutput = 'javascript:(function() { alert("Hey!") })();';
        const input = 'javascript:(function() { alert("Hey!") })();';

        const output = prefixer().pack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not add prefix if one exists at start of string with space padding', () => {
        const expectedOutput = 'javascript: (function() { alert("Hey!") })();';
        const input = 'javascript: (function() { alert("Hey!") })();';

        const output = prefixer().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('unpack', () => {
      it('removes prefix from start of string', () => {
        const expectedOutput = '(function() { alert("Hey!") })();';
        const input = 'javascript:(function() { alert("Hey!") })();';

        const output = prefixer().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('removes prefix from start of string with space padding', () => {
        const expectedOutput = '(function() { alert("Hey!") })();';
        const input = 'javascript: (function() { alert("Hey!") })();';

        const output = prefixer().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not remove prefix when not at start of string', () => {
        const expectedOutput = '(function() { alert("javascript: ") })();';
        const input = '(function() { alert("javascript: ") })();';

        const output = prefixer().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('uriComponent', () => {
    describe('pack', () => {
      it('URI encodes the string', () => {
        const expectedOutput =
          '(function()%20%7B%20alert(%22Hey!%22)%3B%20%7D)()%3B';
        const input = '(function() { alert("Hey!"); })();';

        const output = uriComponent().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('unpack', () => {
      it('URI decodes the string', () => {
        const expectedOutput = '(function() { alert("Hey!"); })();';
        const input = '(function()%20%7B%20alert(%22Hey!%22)%3B%20%7D)()%3B';

        const output = uriComponent().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('format', () => {
    describe('unpack', () => {
      it('beutifies the code', () => {
        const expectedOutput = `(function() {\n    alert("Hey!");\n})();`;
        const input = '(function(){alert("Hey!");})();';
        const output = format().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('pack', () => {
      it('minifies the code', () => {
        const expectedOutput =
          '(function(){function doAlert(){alert("Hey!")}doAlert()})();';
        const input =
          '(function() {\n    function doAlert() {\n      alert("Hey!");\n}    doAlert();\n})();';
        const output = format().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('newlines', () => {
    describe('unpack', () => {
      it('adds newlines from packed comment found at the end of the string', () => {
        const input =
          '(function() {    function doAlert() {      alert("Hey!");    }    doAlert()    doAlert();})();//@n13,38,59,65,66,80,95';
        const expectedOutput =
        '(function() {\n    function doAlert() {\n      alert("Hey!");\n    }\n\n    doAlert()\n    doAlert();\n})();';

        const output = newlines().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('pack', () => {
      it('removes newlines and packs them in a comment at the end of the string', () => {
        const input =
          '(function() {\n    function doAlert() {\n      alert("Hey!");\n    }\n\n    doAlert()\n    doAlert();\n})();';
        const expectedOutput =
          '(function() {    function doAlert() {      alert("Hey!");    }    doAlert()    doAlert();})();//@n13,38,59,65,66,80,95';

        const output = newlines().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });
});
