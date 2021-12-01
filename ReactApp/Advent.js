const React = require('react');
const { useState } = require('react');
const { render, Text, Box } = require('ink');
const { PHASE_TYPE, OPTION_TYPE, OPTION_COMPONENT } = require('./constants');
const importJsx = require('import-jsx');
const figlet = require('figlet');

const Options = importJsx('./Options');
const Day = importJsx('./Day');

const Advent = () => {
  const [phase, setPhase] = useState(PHASE_TYPE.OPTIONS);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const onSelectOption = selectedOption => {
    if (selectedOption === OPTION_TYPE.EXIT) process.exit(0);

    setSelectedOption(selectedOption);
    setPhase(PHASE_TYPE.DAY);
  };

  const onSelectDay = selectedDay => {
    setSelectedDay(selectedDay);
    setPhase(PHASE_TYPE.IN_PROGRESS);
  };

  const onFinish = () => {
    setPhase(PHASE_TYPE.OPTIONS);
    setSelectedOption(null);
    setSelectedDay(null);
  };

  const RunningOption = OPTION_COMPONENT[selectedOption];
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="green">{figlet.textSync(`Advent of Code ${process.env.ADVENT_YEAR}`, 'Big Money-nw')}</Text>
      </Box>
      {phase === PHASE_TYPE.OPTIONS && <Options onSelect={onSelectOption} />}
      {phase === PHASE_TYPE.DAY && <Day onSelect={onSelectDay} />}
      {phase === PHASE_TYPE.IN_PROGRESS && <RunningOption day={selectedDay} onFinish={onFinish} />}
    </Box>
  );
};

process.stdout.write('\x1Bc');

render(<Advent />);
