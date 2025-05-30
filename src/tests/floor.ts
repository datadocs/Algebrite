import { run_test } from '../test-harness.js';

run_test([
  'floor(a)',
  'floor(a)',

  'floor(a+b)',
  'floor(a+b)',

  'floor(5/2)',
  '2',

  'floor(4/2)',
  '2',

  'floor(3/2)',
  '1',

  'floor(2/2)',
  '1',

  'floor(1/2)',
  '0',

  'floor(0/2)',
  '0',

  'floor(-1/2)',
  '-1',

  'floor(-2/2)',
  '-1',

  'floor(-3/2)',
  '-2',

  'floor(-4/2)',
  '-2',

  'floor(-5/2)',
  '-3',

  'floor(5/2.0)',
  '2.0',

  'floor(4/2.0)',
  '2.0',

  'floor(3/2.0)',
  '1.0',

  'floor(2/2.0)',
  '1.0',

  'floor(1/2.0)',
  '0.0',

  'floor(0.0)',
  '0.0',

  'floor(-1/2.0)',
  '-1.0',

  'floor(-2/2.0)',
  '-1.0',

  'floor(-3/2.0)',
  '-2.0',

  'floor(-4/2.0)',
  '-2.0',

  'floor(-5/2.0)',
  '-3.0'
]);
