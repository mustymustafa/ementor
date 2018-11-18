//votes is the array of numbers
module.exports = function calculate(votes) {
  var total = 0;

  for (var i = 0; i < votes.length; i++) {
    total += votes[i];
  }

  return (total / votes.length).toPrecision(2);
};
