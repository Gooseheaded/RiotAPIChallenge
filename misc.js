'use strict';

var scoreToLetter = function(score) {
  switch(score) {
    case 1: return 'C-';
    case 2: return 'C';
    case 3: return 'C+';
    case 4: return 'B-';
    case 5: return 'B';
    case 6: return 'B+';
    case 7: return 'A-';
    case 8: return 'A';
    case 9: return 'A+';
    case 10: return 'S-';
    case 11: return 'S';
    case 12: return 'S+';
    default: return 'Error';
  }
}

module.exports = scoreToLetter;
