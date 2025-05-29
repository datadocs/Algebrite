import {
  ARCSINH,
  cadr,
  car,
  Constants,
  isdouble,
  SINH,
  U
} from '../runtime/defs.js';
import { symbol } from "../runtime/symbol.js";
import { double } from './bignum.js';
import { Eval } from './eval.js';
import { isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';

/* arcsinh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the inverse hyperbolic sine of x.

*/
export function Eval_arcsinh(x: U) {
    return arcsinh(Eval(cadr(x)));
}

function arcsinh(x: U): U {
  if (car(x) === symbol(SINH)) {
    return cadr(x);
  }

  if (isdouble(x)) {
    let { d } = x;
    d = Math.log(d + Math.sqrt(d * d + 1.0));
    return double(d);
  }

  if (isZeroAtomOrTensor(x)) {
    return Constants.zero;
  }

  return makeList(symbol(ARCSINH), x);
}
