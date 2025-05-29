import { ARCCOSH, cadr, car, Constants, COSH, isdouble, U } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { symbol } from '../runtime/symbol.js';
import { double } from './bignum.js';
import { Eval } from './eval.js';
import { isplusone } from './is.js';
import { makeList } from './list.js';

/* arccosh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic cosine of x.

*/
export function Eval_arccosh(x: U) {
  return arccosh(Eval(cadr(x)));
}

function arccosh(x: U): U {
  if (car(x) === symbol(COSH)) {
    return cadr(x);
  }

  if (isdouble(x)) {
    let { d } = x;
    if (d < 1.0) {
      stop('arccosh function argument is less than 1.0');
    }
    d = Math.log(d + Math.sqrt(d * d - 1.0));
    return double(d);
  }

  if (isplusone(x)) {
    return Constants.zero;
  }

  return makeList(symbol(ARCCOSH), x);
}
