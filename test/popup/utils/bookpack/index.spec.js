import assert from 'assert';
import sinon from 'sinon';

import {
  pack,
  unpack,
  prefixPipe,
  uriComponentPipe,
  formatPipe,
  newlinesPipe
} from '../../../../src/utils/bookpack';

const sandbox = sinon.createSandbox();

describe('Bookpack', () => {
  describe('pack', () => {
    it('executes pipes in order', () => {
      const packStub = { pack: () => {} };
      const pipeStub1 = sandbox.stub().returns(packStub);
      const pipeStub2 = sandbox.stub().returns(packStub);
      const pipeStub3 = sandbox.stub().returns(packStub);

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      pack('', pipeline);

      sandbox.assert.callOrder(pipeStub1, pipeStub2, pipeStub3);
    });

    it('executes pack method on each pipe in order', () => {
      const packStub1 = sandbox.stub();
      const packStub2 = sandbox.stub();
      const packStub3 = sandbox.stub();

      const pipeStub1 = () => { return { pack: packStub1 } };
      const pipeStub2 = () => { return { pack: packStub2 } };
      const pipeStub3 = () => { return { pack: packStub3 } };

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      pack('', pipeline);

      sandbox.assert.callOrder(packStub1, packStub2, packStub3);
    });

    it('chains output from pipes', () => {
      const expectedOutput = '123abc';
      const pipeStub1 = sandbox.stub().callsFake(() => { return { pack: (str) => str + 'a' } });
      const pipeStub2 = sandbox.stub().callsFake(() => { return { pack: (str) => str + 'b' } });
      const pipeStub3 = sandbox.stub().callsFake(() => { return { pack: (str) => str + 'c' } });

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      const output = pack('123', pipeline);

      assert.strictEqual(output, expectedOutput);
    });
  });

  describe('unpack', () => {
    it('executes pipes in reverse order', () => {
      const packStub = { unpack: () => {} };
      const pipeStub1 = sandbox.stub().returns(packStub);
      const pipeStub2 = sandbox.stub().returns(packStub);
      const pipeStub3 = sandbox.stub().returns(packStub);

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      unpack('', pipeline);

      sandbox.assert.callOrder(pipeStub3, pipeStub2, pipeStub1);
    });

    it('executes pack method on each pipe in reverse order', () => {
      const packStub1 = sandbox.stub();
      const packStub2 = sandbox.stub();
      const packStub3 = sandbox.stub();

      const pipeStub1 = () => { return { unpack: packStub1 } };
      const pipeStub2 = () => { return { unpack: packStub2 } };
      const pipeStub3 = () => { return { unpack: packStub3 } };

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      unpack('', pipeline);

      sandbox.assert.callOrder(packStub3, packStub2, packStub1);
    });

    it('chains output from pipes', () => {
      const expectedOutput = 'abc123';
      const pipeStub1 = sandbox.stub().callsFake(() => { return { unpack: (str) => 'a' + str } });
      const pipeStub2 = sandbox.stub().callsFake(() => { return { unpack: (str) => 'b' + str } });
      const pipeStub3 = sandbox.stub().callsFake(() => { return { unpack: (str) => 'c' + str } });

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      const output = unpack('123', pipeline);

      assert.strictEqual(output, expectedOutput);
    });

    it('does not mutate original pipeline order', () => {
      const packStub = { unpack: () => {} };
      const pipeStub1 = sandbox.stub().returns(packStub);
      const pipeStub2 = sandbox.stub().returns(packStub);
      const pipeStub3 = sandbox.stub().returns(packStub);

      const pipeline = [pipeStub1, pipeStub2, pipeStub3];

      unpack('', pipeline);

      sandbox.assert.callOrder(pipeStub3, pipeStub2, pipeStub1);

      pipeStub1.resetHistory();
      pipeStub2.resetHistory();
      pipeStub3.resetHistory();

      unpack('', pipeline);

      sandbox.assert.callOrder(pipeStub3, pipeStub2, pipeStub1);
    });
  });

  describe('prefixPipe', () => {
    describe('pack', () => {
      it('adds prefix to start of string', () => {
        const expectedOutput = 'javascript:(function() { alert("Hey!") })();';
        const input = '(function() { alert("Hey!") })();';

        const output = prefixPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not add prefix if one exists at start of string', () => {
        const expectedOutput = 'javascript:(function() { alert("Hey!") })();';
        const input = 'javascript:(function() { alert("Hey!") })();';

        const output = prefixPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not add prefix if one exists at start of string with space padding', () => {
        const expectedOutput = 'javascript: (function() { alert("Hey!") })();';
        const input = 'javascript: (function() { alert("Hey!") })();';

        const output = prefixPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('unpack', () => {
      it('removes prefix from start of string', () => {
        const expectedOutput = '(function() { alert("Hey!") })();';
        const input = 'javascript:(function() { alert("Hey!") })();';

        const output = prefixPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('removes prefix from start of string with space padding', () => {
        const expectedOutput = '(function() { alert("Hey!") })();';
        const input = 'javascript: (function() { alert("Hey!") })();';

        const output = prefixPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });

      it('does not remove prefix when not at start of string', () => {
        const expectedOutput = '(function() { alert("javascript: ") })();';
        const input = '(function() { alert("javascript: ") })();';

        const output = prefixPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('uriComponentPipe', () => {
    describe('pack', () => {
      it('URI encodes the string', () => {
        const expectedOutput =
          '(function()%20%7B%20alert(%22Hey!%22)%3B%20%7D)()%3B';
        const input = '(function() { alert("Hey!"); })();';

        const output = uriComponentPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('unpack', () => {
      it('URI decodes the string', () => {
        const expectedOutput = '(function() { alert("Hey!"); })();';
        const input = '(function()%20%7B%20alert(%22Hey!%22)%3B%20%7D)()%3B';

        const output = uriComponentPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('formatPipe', () => {
    describe('unpack', () => {
      it('beutifies the code', () => {
        const expectedOutput = `(function() {\n    alert("Hey!");\n})();`;
        const input = '(function(){alert("Hey!");})();';
        const output = formatPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('pack', () => {
      it('minifies the code', () => {
        const expectedOutput =
          '(function(){function doAlert(){alert("Hey!")}doAlert()})();';
        const input =
          '(function() {\n    function doAlert() {\n      alert("Hey!");\n}    doAlert();\n})();';
        const output = formatPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });

  describe('newlinesPipe', () => {
    describe('unpack', () => {
      it('adds newlines from packed comment found at the end of the string', () => {
        const input =
          '(function() {    function doAlert() {      alert("Hey!");    }    doAlert()    doAlert();})();//@n13,38,59,65,66,80,95';
        const expectedOutput =
        '(function() {\n    function doAlert() {\n      alert("Hey!");\n    }\n\n    doAlert()\n    doAlert();\n})();';

        const output = newlinesPipe().unpack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });

    describe('pack', () => {
      it('removes newlines and packs them in a comment at the end of the string', () => {
        const input =
          '(function() {\n    function doAlert() {\n      alert("Hey!");\n    }\n\n    doAlert()\n    doAlert();\n})();';
        const expectedOutput =
          '(function() {    function doAlert() {      alert("Hey!");    }    doAlert()    doAlert();})();//@n13,38,59,65,66,80,95';

        const output = newlinesPipe().pack(input);

        assert.strictEqual(output, expectedOutput);
      });
    });
  });
});
