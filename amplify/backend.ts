import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { helloWorldFunction } from './functions/hello_world_function/resource';

defineBackend({
  auth,
  data,
  helloWorldFunction
});
