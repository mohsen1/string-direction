var LTR_MARK = "\u200e",
    RTL_MARK = "\u200f",
    LTR = 'ltr',
    RTL = 'rtl',
    BIDI = 'bidi';

var rtlSciriptRanges = {
  Hebrew:   ["0590","05FF"],
  Arabic:   ["0600","06FF"],
  NKo:      ["07C0","07FF"],
  Syriac:   ["0700","074F"],
  Thaana:   ["0780","07BF"],
  Tifinagh: ["2D30","2D7F"],
}

function getDirection(string) {

  if(typeof string === 'undefined'){
    throw new Error('TypeError missing argument');
  }

  if(typeof string !== 'string'){
    throw new Error('TypeError getDirection expects strings');
  }

  if(string.indexOf(LTR_MARK) > -1 && string.indexOf(RTL_MARK) > -1) {
    return BIDI;
  }

  else if(string.indexOf(LTR_MARK) > -1) {
    return LTR;
  }

  else if(string.indexOf(RTL_MARK) > -1) {
    return RTL;
  }

  else if(hasCharacters(string, RTL) && hasCharacters(string, LTR)) {
    return BIDI;
  }

  else if(hasCharacters(string, LTR)) {
    return LTR;
  }

  else if(hasCharacters(string, RTL)) {
    return RTL;
  }

  else {
    return LTR;
  }

}

function hasCharacters(string, direction) {
  var i, char, range, isRtl = false;

  for(i=0; i<string.length; i++) {
    char = string.charAt(i);

    for (range in rtlSciriptRanges) {

      if (rtlSciriptRanges.hasOwnProperty(range)) {

        if (isInScriptRange( char,
          rtlSciriptRanges[range][0],
          rtlSciriptRanges[range][1])
          ){
          isRtl = true;
        }
      }
    }
  }

  if(direction === RTL)
    return isRtl;
  if(direction === LTR)
    return !isRtl;
}


function isInScriptRange(char, from, to) {
  var charCode = char.charCodeAt(0),
      fromCode = parseInt(from, 16),
      toCode = parseInt(to, 16);

  return charCode > fromCode && charCode < toCode;
}

 function patchStringPrototype () {
  String.prototype.getDirection = function() {
    return getDirection(this.valueOf());
  };
}


if(typeof exports !== 'undefined') {
  exports.getDirection = getDirection;
  exports.patch = patchStringPrototype;
} else {
  var stringDirection = {
    getDirection: getDirection,
    patch: patchStringPrototype
  }
}