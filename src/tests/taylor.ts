import { run_test } from '../test-harness.js';

run_test([
  'taylor(1/(5+4*cos(x)),x,6,0)-(1/9+2/81*x^2+5/1458*x^4+49/131220*x^6)',
  '0',

  'taylor(1/(5+4*cos(x)),x,6)-(1/9+2/81*x^2+5/1458*x^4+49/131220*x^6)',
  '0'
]);
