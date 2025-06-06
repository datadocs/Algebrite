import { run_test } from '../test-harness.js';

run_test([
  'erf(a)',
  'erf(a)',

  'erf(0.0) + 1',
  '1.0',

  'float(erf(0))',
  '0.0',

  'erf(0.0)',
  '0.0',

  'erf(-0.0)',
  '0.0',

  'erf(0)',
  '0',

  'erf(-0)',
  '0',

  'float(erf(0)) + 1',
  '1.0',

  'float(erf(1))',
  '0.842701...'
]);
