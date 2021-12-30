const chalk = require("chalk");
const _ = require("lodash/fp");

const parse = (input) => input.split("\n");

const groupByInput = (instructions) => {
  let groupedInstructions = [];
  let i = -1;
  instructions.forEach((instruction, j) => {
    if (instruction === "inp w") {
      i++;
      groupedInstructions[i] = { from: j, instructions: [instruction] };
    } else {
      groupedInstructions[i].instructions.push(instruction);
    }
  });
  return groupedInstructions;
};

const wholeDiv = (a, b) => {
  if (a / b > 0) {
    return Math.floor(a / b);
  } else {
    return Math.ceil(a / b);
  }
};

const part1 = (input) => {
  const instructions = parse(input);
  const grouped = groupByInput(instructions);
  const groups = grouped.map(({ instructions }) => ({
    isReduce: Number(instructions[4].split(" ")[2]) === 26,
    a: Number(instructions[5].split(" ")[2]),
    b: Number(instructions[15].split(" ")[2]),
  }));
  const calcGroup = (group, input, z) => {
    let temp = group.isReduce ? wholeDiv(z, 26) : z;
    if ((z % 26) + group.a !== input) {
      return temp * 26 + input + group.b;
    }
    return temp;
  };
  console.log(groups);
  const fastCalc = (digits) => {
    let z = 0;
    groups.forEach((group, i) => {
      const requiredNumber = (z % 26) + group.a;
      console.log(
        {
          z: z.toString(26).padStart(7, " "),
          d: digits[i],
          r: requiredNumber,
        },
        group.isReduce
          ? chalk.green(`a: ${group.a}, b: ${group.b}`)
          : chalk.red(`a: ${group.a}, b: ${group.b}`),
        requiredNumber < 10 && requiredNumber > 0
          ? digits[i] === requiredNumber
            ? chalk.magenta("match")
            : chalk.cyan("can match")
          : ""
      );
      z = calcGroup(group, digits[i], z);
    });
    console.log({ z: z.toString(26).padStart(7, " ") });
    return z;
  };
  fastCalc([1, 3, 1, 9, 1, 9, 1, 3, 5, 7, 1, 2, 1, 1]);
};

const part2 = (input) => {
  parse(input);
};

module.exports = { part1, part2, ALU };
