import { setup } from '../src/setup';

before(async () => {
  await setup();
});

require('./hello.test');
require('./create-user.test');
require('./login.test');
