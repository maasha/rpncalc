/* eslint-disable no-unused-expressions */

import { afterEach, beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
// import fs from 'fs';
import sinon from 'sinon';
import History from '../../app/utils/history.util';

const fs = require('fs');

/**
 * Max number of elements on the history array.
 * @type {Number}
 */
const MAX_LENGTH = 50;

describe('history.util -> History Class', () => {
  describe('constructor', () => {
    const history = new History();
    it('should have two properties', () => {
      expect(Object.keys(history).length).to.eql(2);
    });

    it('should have property ary', () => {
      expect(history).to.have.property('ary');
    });

    it('should have property maxLength', () => {
      expect(history).to.have.property('maxLength');
    });

    describe('without parameter', () => {
      it('should have empty ary', () => {
        expect(history.ary).to.eql([]);
      });

      it('should have default maxLength', () => {
        expect(history.maxLength).to.eql(MAX_LENGTH);
      });
    });

    describe('with parameter [[2], [2, 5]]', () => {
      const history2 = new History([[2], [2, 5]]);
      it('should have ary [[2], [2, 5]]', () => {
        expect(history2.ary).to.eql([[2], [2, 5]]);
      });
    });

    describe('with parameters [[2], [2, 5]], 7', () => {
      const history2 = new History([[2], [2, 5]], 7);
      it('should have ary [[2], [2, 5]]', () => {
        expect(history2.ary).to.eql([[2], [2, 5]]);
      });

      it('should have maxLength 7', () => {
        expect(history2.maxLength).to.eql(7);
      });
    });
  });

  describe('last', () => {
    describe('with empty history', () => {
      const history = new History();
      it('should return an empty ary', () => {
        expect(history.last()).to.eql([]);
      });
    });

    describe('with one event history', () => {
      const history = new History([[1]]);
      it('should return the last ary', () => {
        expect(history.last()).to.eql([1]);
      });
    });

    describe('with two event history', () => {
      const history = new History([[1], [1, 2]]);
      it('should return the last ary', () => {
        expect(history.last()).to.eql([1, 2]);
      });
    });
  });

  describe('pop', () => {
    describe('with empty history', () => {
      const history = new History();
      it('should return an empty ary', () => {
        expect(history.pop()).to.eql([]);
      });
    });

    describe('with one event history', () => {
      const history = new History([[1]]);
      it('should return the last ary', () => {
        expect(history.pop()).to.eql([1]);
      });

      it('should leave an empty history ary', () => {
        expect(history.last()).to.eql([]);
      });
    });

    describe('with two event history', () => {
      const history = new History([[1], [1, 2]]);
      it('should return the last ary', () => {
        expect(history.pop()).to.eql([1, 2]);
      });

      it('should leave the first element on the stack', () => {
        expect(history.last()).to.eql([1]);
      });
    });
  });

  describe('push', () => {
    describe('with empty history', () => {
      const history = new History();
      it('should add new element', () => {
        expect(history.push([1]).last()).to.eql([1]);
      });
    });

    describe('with one event history', () => {
      const history = new History([1]);
      it('should add new element', () => {
        expect(history.push([2]).last()).to.eql([2]);
      });
    });

    describe('with maxLength 2', () => {
      const history = new History([1], 2);
      history.push([1, 2]);
      history.push([3]);
      history.push([5, 6]);
      it('should have 2 elements', () => {
        expect(history.ary.length).to.eql(2);
      });

      it('should have last element [5, 6]', () => {
        expect(history.last()).to.eql([5, 6]);
      });

      it('should have first element [3]', () => {
        expect(history.ary[0]).to.eql([3]);
      });
    });
  });

  describe('load', () => {
    const fileName = 'foo';
    const sandbox = sinon.sandbox.create();
    let history;

    beforeEach(() => {
      history = new History();
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('with no existing history file', () => {
      it('should have an empty history ary', () => {
        // make `fs.existsSync()` return false
        const stub = sandbox.stub(fs, 'existsSync').returns(false);
        history.load();
        expect(history.ary).to.eql([]);
      });
    });

    describe('with existing history file', () => {
      it('should load the content into the history ary', () => {
        // make `fs.existsSync()` return false
        const stub1 = sandbox.stub(fs, 'existsSync').returns(true);
        const stub2 = sandbox.stub(fs, 'readFileSync').returns('[[1], [2, 3]]');
        history.load();
        expect(history.ary).to.eql([[1],[2, 3]]);
      });
    });
  });

  // describe('load', () => {
  //   const fileName = 'foo';
  //   const sandbox = sinon.sandbox.create();
  //   let history;
  //
  //   // Create a fresh instance for each test.
  //   beforeEach(() => {
  //     history = new History();
  //   });
  //
  //   // Restore the sandbox after each test.
  //   afterEach(() => {
  //     sandbox.restore();
  //   });
  //
  //   it('should call `fs.existsSync` with the correct file path', () => {
  //     // make `fs.existsSync()` return false, we're only testing its arguments
  //     const stub = sandbox.stub(fs, 'existsSync').returns(false);
  //     history.load();
  //     expect(stub.calledWith(fileName)).to.be.true;
  //   });
  // });

  describe('save', () => {

  });
});
