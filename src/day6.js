const _ = require('lodash/fp');

const parse = input => input.split(',').map(Number);

class HatchTimer {
  constructor(initialTimeLeft) {
    this.timeLeft = initialTimeLeft;
    this.currentAmount = 0;
  }

  step() {
    this.timeLeft = this.timeLeft === 0 ? 8 : this.timeLeft - 1;
    return this.timeLeft === 8 ? this.currentAmount : 0;
  }

  addFish(amount) {
    this.currentAmount += amount;
  }
}

const processDays = (input, days) => {
  const state = parse(input);
  const hatchTimers = Array.from({ length: 9 }).map((_, i) => new HatchTimer(i));
  state.forEach(fishTime => hatchTimers[fishTime].addFish(1));

  for (let day = 0; day < days; day++) {
    let newFish = 0;
    hatchTimers.forEach(timer => (newFish += timer.step()));
    const i = hatchTimers.findIndex(timer => timer.timeLeft === 6);
    hatchTimers[i].addFish(newFish);
  }

  return _.sumBy('currentAmount', hatchTimers);
};

const part1 = input => {
  return processDays(input, 80);
};

const part2 = input => {
  return processDays(input, 256);
};

module.exports = { part1, part2 };
