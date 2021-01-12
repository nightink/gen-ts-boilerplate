
import assert = require('assert');

import index from '../src/index';

describe('test/index.test.ts', () => {
  it('hello world', () => {
    assert.strictEqual(index(), 'Hello World!');
  });
});