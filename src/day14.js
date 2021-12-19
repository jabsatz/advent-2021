const _ = require('lodash/fp');

class PolymerProcessor {
  constructor({ initialTemplate, rules }) {
    this.polymer = {};
    this.rules = rules;
    this.initialTemplate = initialTemplate;
    for (let i = 0; i < initialTemplate.length - 1; i++) {
      const pair = initialTemplate.substring(i, i + 2);
      const output = rules[pair];
      if (output) {
        if (!this.polymer[pair]) {
          this.polymer[pair] = 1;
        } else {
          this.polymer[pair] += 1;
        }
      }
    }
  }

  processStep() {
    let newPolymer = {};
    Object.entries(this.polymer).forEach(([pair, amount]) => {
      const output = this.rules[pair];
      if (output) {
        const newPairs = [`${pair[0]}${output}`, `${output}${pair[1]}`];
        newPairs.forEach(newPair => {
          if (!newPolymer[newPair]) {
            newPolymer[newPair] = amount;
          } else {
            newPolymer[newPair] += amount;
          }
        });
      }
    });
    this.polymer = newPolymer;
  }

  processSteps(n) {
    for (let step = 1; step <= n; step++) {
      this.processStep();
    }
  }

  getSum() {
    let frequencyMap = {};
    Object.entries(this.polymer).forEach(([pair, amount]) => {
      pair.split('').forEach(letter => {
        if (!frequencyMap[letter]) {
          frequencyMap[letter] = amount;
        } else {
          frequencyMap[letter] += amount;
        }
      });
    });
    frequencyMap[this.initialTemplate[0]]++;
    frequencyMap[this.initialTemplate[this.initialTemplate.length - 1]]++;
    const orderedLetters = _.sortBy(([_, val]) => -val, Object.entries(frequencyMap));
    return (orderedLetters[0][1] - _.last(orderedLetters)[1]) / 2;
  }
}

const parse = input => {
  const [initialTemplate, rawRules] = input.split('\n\n');
  let rules = {};
  rawRules.split('\n').forEach(rule => {
    const [input, output] = rule.split(' -> ');
    rules[input] = output;
  });
  return { initialTemplate, rules };
};

const part1 = input => {
  const { initialTemplate, rules } = parse(input);
  const polymerProcessor = new PolymerProcessor({ initialTemplate, rules });
  polymerProcessor.processSteps(10);
  return polymerProcessor.getSum();
};

const part2 = input => {
  const { initialTemplate, rules } = parse(input);
  const polymerProcessor = new PolymerProcessor({ initialTemplate, rules });
  polymerProcessor.processSteps(40);
  return polymerProcessor.getSum();
};

module.exports = { part1, part2 };
