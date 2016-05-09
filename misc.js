'use strict';

var calculateScore = function(match) {

}

var scoreToGrade = function(score) {
  switch(score) {
    case 0: return 'F';
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

var gradeToScore = function(score) {
  if(score === 'F') { return 0; }
  else if(score === 'C-') { return 1; }
  else if(score === 'C') { return 2; }
  else if(score === 'C+') { return 3; }
  else if(score === 'B-') { return 4; }
  else if(score === 'B') { return 5; }
  else if(score === 'B+') { return 6; }
  else if(score === 'A-') { return 7; }
  else if(score === 'A') { return 8; }
  else if(score === 'A+') { return 9; }
  else if(score === 'S-') { return 10; }
  else if(score === 'S') { return 11; }
  else if(score === 'S+') { return 12; }
  else { return -1; }
}

module.exports = {
  'scoreToGrade': scoreToGrade,
  'gradeToScore': gradeToScore,
}
