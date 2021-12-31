import { login } from './module/login.js';
import { auth } from './module/auth';
import { profile } from './module/profile.js';

login((token) => {
  // console.log(token)
  // run the other tests in the callback
  auth(() => {});
  profile(token)
});
