import { caddr, cadr, NIL, U } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { degree } from './degree.js';
import { Eval } from './eval.js';
import { filter } from './filter.js';
import { guess } from './guess.js';
import { divide } from './multiply.js';
import { power } from './power.js';

/*
 Return the leading coefficient of a polynomial.

Example

  leading(5x^2+x+1,x)

Result

  5

The result is undefined if P is not a polynomial.
*/
export function Eval_leading(p1: U) {
  const P = Eval(cadr(p1));
  p1 = Eval(caddr(p1));
  const X = p1 === symbol(NIL) ? guess(P) : p1;
  return leading(P, X);
}

function leading(P: U, X: U) {
  // N = degree of P
  const N = degree(P, X);

  // divide through by X ^ N, remove terms that depend on X
  return filter(divide(P, power(X, N)), X);
}
