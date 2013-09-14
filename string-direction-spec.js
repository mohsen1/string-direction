/*
  Tests are written in Jasmine. 
  To run tests
    npm install
    npm test
*/

var ltrText = 'Hello, world!',
    rtlText = 'سلام دنیا',
    bidiText = 'Hello in Farsi is سلام';

describe('String Direction', function(){
  var stringDirection = require('./index');

  describe('#getDirection', function(){

    it('return correct direction when calling stringDirection.getDirection and passing string variables', function(){
      expect(stringDirection.getDirection(ltrText)).toBe('ltr');
      expect(stringDirection.getDirection(rtlText)).toBe('rtl');
      expect(stringDirection.getDirection(bidiText)).toBe('bidi');
    });

  });

  describe('#patch', function(){
    stringDirection.patch();

    it('return correct direction when calling getDirection on string variables', function(){
      expect(ltrText.getDirection()).toBe('ltr');
      expect(ltrText.getDirection()).toBe('rtl');
      expect(bidiText.getDirection()).toBe('bidi');
    });

  });

});