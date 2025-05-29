import { BESSELY, caddr, cadr, Constants, isdouble, U } from '../runtime/defs.js';
import { yn } from '../runtime/otherCFunctions.js';
import { symbol } from '../runtime/symbol.js';
import { double, nativeInt } from './bignum.js';
import { Eval } from './eval.js';
import { isnegativeterm } from './is.js';
import { makeList } from './list.js';
import { multiply, negate } from './multiply.js';
import { power } from './power.js';

/* bessely =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x,n

General description
-------------------

Bessel function of second kind.

*/
export function Eval_bessely(p1: U) {
  return bessely(Eval(cadr(p1)), Eval(caddr(p1)));
}

export function bessely(p1: U, p2: U): U {
  return yybessely(p1, p2);
}

function yybessely(X: U, N: U): U {
  const n = nativeInt(N);

  if (isdouble(X) && !isNaN(n)) {
    const d = yn(n, X.d);
    return double(d);
  }

  if (isnegativeterm(N)) {
    return multiply(power(Constants.negOne, N), makeList(symbol(BESSELY), X, negate(N)));
  }

  return makeList(symbol(BESSELY), X, N);
}
