import padStart from 'lodash/padStart';

const getLogTime = () => {
  const date = new Date();
  const month = padStart(date.getMonth().toString(), 2, '0');
  const day = padStart(date.getDay().toString(), 2, '0');
  const year = date.getFullYear();
  const time = `${padStart(date.getHours().toString(), 2, '0')}:${padStart(
    date.getMinutes().toString(),
    2,
    '0'
  )}:${padStart(date.getSeconds().toString(), 2, '0')}`;

  return `${month}/${day}/${year} ${time}`;
};

const debug = (...target: any[]) => {
  const time = getLogTime();
  console.debug(time, ...target);
};

const error = (...target: any[]) => {
  const time = getLogTime();
  console.error(time, ...target);
};

export const log = {
  debug,
  error,
};
