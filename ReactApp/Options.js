const React = require('react');
const { useState } = require('react');
const { Text, useInput, Box } = require('ink');
const { options } = require('./constants');

const useOptions = options => {
  const [selectedOption, setSelectedOption] = useState(0);
  useInput((_, key) => {
    if (key.leftArrow || key.upArrow) {
      setSelectedOption(s => (s - 1 < 0 ? options.length - 1 : s - 1));
    } else if (key.rightArrow || key.downArrow) {
      setSelectedOption(s => (s + 1 === options.length ? 0 : s + 1));
    }
  });

  return selectedOption;
};

const Options = ({ onSelect }) => {
  const selectedIndex = useOptions(options);
  const selectedKey = options[selectedIndex].key;
  useInput((_, key) => {
    if (key.return) {
      onSelect(selectedKey);
    }
  });

  return (
    <Box>
      {options.map((option, i) => {
        const selected = selectedIndex === i;
        return (
          <Box key={option.key} marginRight={selected ? 15 : 20}>
            <Text color={selected ? 'cyan' : 'white'}>
              {option.name}
              {selected ? ' <---' : ''}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

module.exports = Options;
