const importJsx = require('import-jsx');
const Run = importJsx('./Run');
const New = importJsx('./New');
const Test = importJsx('./Test');

const OPTION_TYPE = {
  RUN: 'run',
  TEST: 'test',
  NEW: 'new',
  EXIT: 'exit',
};

const PHASE_TYPE = {
  OPTIONS: 'options',
  DAY: 'day',
  IN_PROGRESS: 'in-progress',
};

const OPTION_COMPONENT = {
  [OPTION_TYPE.RUN]: Run,
  [OPTION_TYPE.TEST]: Test,
  [OPTION_TYPE.NEW]: New,
};

const options = [
  { name: 'Run day', key: OPTION_TYPE.RUN },
  { name: 'Test day', key: OPTION_TYPE.TEST },
  { name: 'New day', key: OPTION_TYPE.NEW },
  { name: 'Exit', key: OPTION_TYPE.EXIT },
];

module.exports = { OPTION_TYPE, PHASE_TYPE, OPTION_COMPONENT, options };
