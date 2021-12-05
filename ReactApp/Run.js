const React = require('react');
const { useState, useEffect } = require('react');
const { Text, useInput, Box, Newline } = require('ink');
const { performance: p } = require('perf_hooks');

const PerfText = ({ measure }) => {
  const duration =
    measure.duration > 1000
      ? `${(measure.duration / 1000).toFixed(2)}s`
      : `${measure.duration.toFixed(2)}ms`;

  return (
    <>
      <Newline />
      Completed in: <Text color="green">{duration}</Text>
    </>
  );
};

const RunText = ({ result, error, day, measures }) => {
  if (result) {
    return (
      <Text color="whiteBright">
        Part 1 result: <Text color="cyan">{result[0]}</Text>
        {measures && <PerfText measure={measures[0]} />}
        <Newline />
        <Newline />
        Part 2 result: <Text color="cyan">{result[1]}</Text>
        {measures && <PerfText measure={measures[1]} />}
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
  const [measures, setMeasures] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = async () => {
      const inputs = require('../src/inputs.json');
      const { part1, part2 } = require(`../src/day${day}`);
      try {
        const start1 = p.now();
        const result1 = await part1(inputs[`day${day}`]);
        const end1 = p.now();
        const measure1 = p.measure('runtime', { start: start1, end: end1 });

        const start2 = p.now();
        const result2 = await part2(inputs[`day${day}`]);
        const end2 = p.now();
        const measure2 = p.measure('runtime', { start: start2, end: end2 });

        setResult([result1, result2]);
        setMeasures([measure1, measure2]);
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
        <RunText day={day} error={error} result={result} measures={measures} />
      </Box>
      {(result || error) && (
        <Box marginTop={1}>
          <Text>Press any key to continue</Text>
        </Box>
      )}
    </Box>
  );
};

module.exports = Run;
