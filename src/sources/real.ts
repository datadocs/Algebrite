import { cadr, U } from '../runtime/defs.js';
import { add } from './add.js';
import { integer } from './bignum.js';
import { conjugate } from './conj.js';
import { Eval } from './eval.js';
import { divide } from './multiply.js';
import { rect } from './rect.js';

/*
 Returns the real part of complex z

  z    real(z)
  -    -------

  a + i b    a

  exp(i a)  cos(a)
*/
export function Eval_real(p1: U) {
  return real(Eval(cadr(p1)));
}

export function real(p: U): U {
  const p1 = rect(p);
  return divide(add(p1, conjugate(p1)), integer(2));
}
