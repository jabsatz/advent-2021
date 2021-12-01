const React = require('react');
const { useEffect, useState } = require('react');
const { Text, useInput, Box, Newline } = require('ink');
const axios = require('axios');
const _ = require('lodash');
const fs = require('fs/promises');

const createTestTemplate = day => `const { part1, part2 } = require('./day${day}')
const input = "";

test('part1', () => {
  expect(part1(input)).toBe(output);
});

test('part2', () => {
  expect(part2(input)).toBe(output);
});
`;

const codeTemplate = `const _ = require('lodash/fp');

const parse = (input) => {

};

const part1 = (input) => {
  parse(input);
};

const part2 = (input) => {
  parse(input);
};

module.exports = { part1, part2 };
`;

const NewText = ({ result, error, day }) => {
  if (result) {
    return (
      <Text color="whiteBright">
        Input fetched for day {day} and created the new file. Redacted Input:
        <Newline />
        <Text color="cyan">
          {result.split('\n').slice(0, 15).join('\n')}
          <Newline />
          ...
        </Text>
      </Text>
    );
  }
  if (error) {
    return (
      <Text color="whiteBright">
        Error: <Text color="redBright">{error}</Text>
      </Text>
    );
  }
  return <Text>Fetching input and creating file for day {day}...</Text>;
};

const New = ({ day, onFinish }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = async () => {
      try {
        await fs.access(`./src/day${day}.js`);
        setError('Code file already exists');
      } catch (error) {
        try {
          const response = await axios({
            url: `https://adventofcode.com/${process.env.ADVENT_YEAR}/day/${day}/input`,
            headers: {
              cookie: `session=${process.env.SESSION_TOKEN}`,
            },
          });
          const inputs = require('../src/inputs.json');
          const newInputs = { ...inputs };
          newInputs[`day${day}`] =
            _.last(response.data) === '\n'
              ? response.data.substring(0, response.data.length - 1)
              : response.data; // remove trailing newline
          await fs.writeFile('./src/inputs.json', JSON.stringify(newInputs), 'utf-8');
          delete require.cache[require.resolve('../src/inputs.json')];
          await fs.writeFile(`./src/day${day}.js`, codeTemplate, 'utf-8');
          await fs.writeFile(`./src/day${day}.test.js`, createTestTemplate(day), 'utf-8');
          setResult(response.data);
        } catch (error) {
          if (error?.response?.status === 404) {
            return setError('Day is not yet available.');
          }
          if (error?.response?.status === 401) {
            return setError(
              'Unauthorized. Did you remember to set the SESSION_TOKEN env variable?',
            );
          }
          console.error(error);
          return setError('Unhandled error');
        }
      }
    };
    if (!isStarted) {
      setIsStarted(true);
      fn();
    }
  }, [isStarted, day]);
  useInput(() => {
    if (result || error) {
      onFinish();
    }
  });

  return (
    <Box flexDirection="column">
      <Box>
        <NewText day={day} error={error} result={result} />
      </Box>
      {(result || error) && (
        <Box>
          <Text>Press any key to continue</Text>
        </Box>
      )}
    </Box>
  );
};

module.exports = New;
