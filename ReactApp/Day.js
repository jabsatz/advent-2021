const React = require('react');
const { useState } = require('react');
const _ = require('lodash');
const { Text, useInput, Box } = require('ink');

const Day = ({ onSelect }) => {
  const [day, setDay] = useState('');

  useInput((input, key) => {
    if (!Number.isNaN(input)) {
      setDay(d => d + input);
    }
    if (key.backspace) {
      setDay(d => d.substring(0, d.length - 1));
    }
    const dayNumber = Number(day);
    if (key.return && dayNumber <= 25 && dayNumber >= 1) {
      onSelect(dayNumber);
    }
  });

  return (
    <Box>
      <Text>Please enter your day number: {day}</Text>
    </Box>
  );
};

module.exports = Day;
