const React = require('react');
const { useState, useEffect, useRef } = require('react');
const fs = require('fs/promises');
const _ = require('lodash');
const { Text, useInput, Box } = require('ink');
const chalk = require('chalk');
const jestCli = require('jest-cli');
const EventEmitter = require('events');

const keyEmitter = new EventEmitter();

const Test = ({ day, onFinish }) => {
  const [currentProcessId, setCurrentProcessId] = useState(0);
  const [error, setError] = useState(null);
  const runningProcesses = useRef([]);

  useEffect(() => {
    const returnCb = () => setCurrentProcessId(id => id + 1);
    const otherCb = () => {
      process.stdout.write('\x1Bc');
      onFinish();
    };
    const fn = async () => {
      try {
        await fs.access(`./src/day${day}.test.js`);
        await jestCli.run([`day${day}`, '--detectOpenHandles']);
        process.removeAllListeners('exit'); // jest adds event listeners to exit, have to remove them to avoid warnings
        if (currentProcessId === _.last(runningProcesses.current)) {
          process.stdout.write('\n\n');
          process.stdout.write(chalk.whiteBright('Press RETURN to run again, or any key to go back.'));
          keyEmitter.on('return', returnCb);
          keyEmitter.on('other', otherCb);
        }
        runningProcesses.current = runningProcesses.current.filter(id => id !== currentProcessId);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return setError("Test file doesn't exist.");
        }
        console.error(error);
        return setError('Uncaught error');
      }
    };
    runningProcesses.current = [...runningProcesses.current, currentProcessId];
    setError(null);
    fn();
    return () => {
      keyEmitter.removeListener('return', returnCb);
      keyEmitter.removeListener('other', otherCb);
    };
  }, [day, currentProcessId]);

  useInput((input, key) => {
    if (key.return) {
      if (error) setCurrentProcessId(id => id + 1);
      else keyEmitter.emit('return');
    } else {
      if (error) onFinish();
      else keyEmitter.emit('other');
    }
  });

  return (
    <Box flexDirection="column">
      {error && (
        <>
          <Text color="redBright">{error}</Text>
          <Box>
            <Text>Press RETURN to run again, or any other key to go back.</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

module.exports = Test;
