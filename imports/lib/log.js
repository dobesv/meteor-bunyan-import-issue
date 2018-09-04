import bunyan from 'bunyan';
import os from 'os';
import PrettyStream from 'bunyan-prettystream';

const streams = [
  {
    level: 'debug',
    name: 'formative',
    stream: process.stdout,
  },
];

if (['development', 'test', 'mocha'].includes(process.env.NODE_ENV)) {
  try {
    console.log('typeof PrettyStream', typeof PrettyStream);
    console.log('Object.keys(PrettyStream)', Object.keys(PrettyStream));
    const prettyStdOut = new PrettyStream({ mode: 'dev' });
    prettyStdOut.pipe(process.stdout);
    streams[0].stream = prettyStdOut;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
  }
}

const log = bunyan.createLogger({
  hostname: process.env.GALAXY_CONTAINER_ID
    ? process.env.GALAXY_CONTAINER_ID.slice(-5)
    : os.hostname(),
  name: 'formative',
  streams,
  serializers: {
    err: err => ({
      code: err.code,
      data: err.data,
      message: err.message,
      name: err.name,
      stack: err.stack,
    }),
  },
});

process.on('unhandledRejection', error => {
  log.error('Unhandled promise rejection', { error });
});

export default log;
