import { Meteor } from 'meteor/meteor';
import log from 'lib/log';

Meteor.startup(() => {
  // code to run on server at startup
  log.info('Hello, world!');
});

