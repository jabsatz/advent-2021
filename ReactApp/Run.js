const React = require('react');
const { useState, useEffect } = require('react');
const { Text, useInput, Box, Newline } = require('ink');

const RunText = ({ result, error, day }) => {
  if (result) {
    return (
      <Text color="whiteBright">
        Part 1 result: <Text color="cyan">{result[0]}</Text>
        <Newline />
        Part 2 result: <Text color="cyan">{result[1]}</Text>
      </Text>
    );
  }
  if (error) {
    console.error(error);
    return <Text>Error while running code.</Text>;
  }
  return <Text>Running day {day}...</Text>;
};

const Run = ({ day, onFinish }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = async () => {
      const inputs = require('../src/inputs.json');
      const { part1, part2 } = require(`../src/day${day}`);
      try {
        const result1 = await part1(inputs[`day${day}`]);
        const result2 = await part2(inputs[`day${day}`]);
        setResult([result1, result2]);
      } catch (err) {
        setError(err);
      }
      delete require.cache[require.resolve(`../src/day${day}`)];
    };
    if (!isStarted) {
      setIsStarted(true);
      setTimeout(fn, 50);
    }
  }, [day, isStarted]);

  useInput(() => {
    if (result || error) onFinish();
  });

  return (
    <Box flexDirection="column">
      <Box>
        <RunText day={day} error={error} result={result} />
      </Box>
      {(result || error) && (
        <Box>
          <Text>Press any key to continue</Text>
        </Box>
      )}
    </Box>
  );
};

module.exports = Run;
