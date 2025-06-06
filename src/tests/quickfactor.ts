import { equal } from '../sources/misc.js';
import { defs, primetab, U } from '../runtime/defs.js';
import { integer } from '../sources/bignum.js';
import { multiply_all } from '../sources/multiply.js';
import { quickfactor, quickpower } from '../sources/quickfactor.js';
import { test } from '../test-harness.js';

test('quickfactor', (t) => {
  for (let i = 2; i < 10001; i++) {
    let base = i;
    const qf = quickfactor(integer(base), integer(1));
    const arr: U[] = [];
    let j = 0;
    while (base > 1) {
      let expo = 0;
      while (base % primetab[j] === 0) {
        base /= primetab[j];
        expo++;
      }
      if (expo) {
        arr.push(quickpower(integer(primetab[j]), integer(expo))[0]);
      }
      j++;
    }
    let p2 = multiply_all(arr);
    let p1 = qf;
    t.is(true, equal(p1, p2), `${p1} != ${p2}`);
  }
});
