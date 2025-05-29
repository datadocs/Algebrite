import {
  ARCTANH,
  cadr,
  car,
  Constants,
  isdouble,
  TANH,
  U
} from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { symbol } from "../runtime/symbol.js";
import { double } from './bignum.js';
import { Eval } from './eval.js';
import { isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';

/* arctanh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic tangent of x.

*/
export function Eval_arctanh(x: U) {
  return arctanh(Eval(cadr(x)));
}

function arctanh(x: U): U {
  if (car(x) === symbol(TANH)) {
    return cadr(x);
  }

  if (isdouble(x)) {
    let { d } = x;
    if (d < -1.0 || d > 1.0) {
      stop('arctanh function argument is not in the interval [-1,1]');
    }
    d = Math.log((1.0 + d) / (1.0 - d)) / 2.0;
    return double(d);
  }

  if (isZeroAtomOrTensor(x)) {
    return Constants.zero;
  }

  return makeList(symbol(ARCTANH), x);
}
