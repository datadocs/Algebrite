import { Constants, MZERO, Num } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { makeSignSameAs } from './bignum.js';
import { mgcd } from './mgcd.js';
import { mdiv, mmul } from './mmul.js';

//  Divide rational numbers
//
//  Input:    p1    dividend
//            p2    divisor
//
//  Output:    quotient
export function qdiv(p1: Num, p2: Num): Num {
  // zero?
  if (MZERO(p2.q.a)) {
    stop('divide by zero');
  }

  if (MZERO(p1.q.a)) {
    return Constants.zero;
  }

  const aa = mmul(p1.q.a, p2.q.b);
  const bb = mmul(p1.q.b, p2.q.a);

  let c = mgcd(aa, bb);

  c = makeSignSameAs(c, bb);

  return new Num(mdiv(aa, c), mdiv(bb, c));
}
