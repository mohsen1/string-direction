(function(){

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
    Tifinagh: ["2D30","2D7F"]
  };


  /*
   * Gets string direction
   * @param {string} - String to check for direction
   * @returns {string} - 'ltr' if given string is left-to-right, 
   * 'rtl' if it's right-to-left and 'bidi' if it has both types of characters 
  */
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

    else if(hasDirectionCharacters(string, RTL) && hasDirectionCharacters(string, LTR)) {
      return BIDI;
    }

    else if(hasDirectionCharacters(string, LTR)) {
      return LTR;
    }

    else if(hasDirectionCharacters(string, RTL)) {
      return RTL;
    }

    else {
      return LTR;
    }

  }
  /**
   * Determine if a string has characters in right-to-left or left-to-right Unicode blocks
   * @param {string} string - String to check for characters
   * @param {string} direction - Direction to check. Either 'ltr' or 'rtl' string
   * @returns {boolean} - True if given string has direction specific characters, False otherwise
  */
  function hasDirectionCharacters(string, direction) {
    var i, char, range, charIsRtl,
        hasRtl = false,
        hasLtr = false;

    // Remove white space
    string = string.replace(/\s+/, '');

    // Loop through each character
    for(i=0; i<string.length; i++) {
      char = string.charAt(i);

      // Assume character is not rtl
      charIsRtl = false;

      // Test each character against all ltr script ranges
      for (range in rtlSciriptRanges) {


        if (rtlSciriptRanges.hasOwnProperty(range)) {

          if ( isInScriptRange( char,
            rtlSciriptRanges[range][0],
            rtlSciriptRanges[range][1]) ){

            // If character is rtl, set rtl flag (hasRtl) for string to true
            hasRtl = true;

            // Set rtl flag for this character to true
            charIsRtl = true;
          }
        }
      }

      // If this character is *not* rtl then it is ltr and string has
      // ltr characters
      if(charIsRtl === false) {
        hasLtr = true;
      }
    }

    if(direction === RTL)
      return hasRtl;
    if(direction === LTR)
      return hasLtr;
  }

  /**
   * Checks if a a character is in a Unicode block range
   * @param {string} char - The character to check. An string with only one character
   * @param {string} from - Starting Unicode code of block in hexadecimal. Example: "2D30"
   * @param {string} to - Ending Unicode code of block in hexadecimal. Example: "2F30"
   * @returns {boolean} - true if char is in range.
  */
  function isInScriptRange(char, from, to) {
    var charCode = char.charCodeAt(0),
        fromCode = parseInt(from, 16),
        toCode = parseInt(to, 16);

    return charCode > fromCode && charCode < toCode;
  }

  /**
   * Monkey-patch String global object to expose getDirection method
  */
   function patchStringPrototype () {
    String.prototype.getDirection = function() {
      return getDirection(this.valueOf());
    };
  }

  // TODO make it AMD friendly
  if(typeof exports !== 'undefined') {
    exports.getDirection = getDirection;
    exports.patch = patchStringPrototype;
  } else {
    this.stringDirection = {
      getDirection: getDirection,
      patch: patchStringPrototype
    };
  }

}).call(this);