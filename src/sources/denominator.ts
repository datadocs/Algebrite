import {
  caddr,
  cadr,
  car,
  cdr,
  Constants,
  isadd,
  ismultiply,
  ispower,
  isrational,
  U
} from '../runtime/defs.js';
import { mp_denominator } from './bignum.js';
import { Eval } from './eval.js';
import { isnegativeterm, isplusone } from './is.js';
import { multiply_all, reciprocate } from './multiply.js';
import { rationalize } from './rationalize.js';

/* denominator =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the denominator of expression x.

*/
export function Eval_denominator(p1: U) {
  return denominator(Eval(cadr(p1)));
}

export function denominator(p1: U): U {
  //console.trace "denominator of: " + p1
  if (isadd(p1)) {
    p1 = rationalize(p1);
  }

  if (ismultiply(p1) && !isplusone(car(cdr(p1)))) {
    return multiply_all(p1.tail().map(denominator));
  }

  if (isrational(p1)) {
    return mp_denominator(p1);
  }

  if (ispower(p1) && isnegativeterm(caddr(p1))) {
    return reciprocate(p1);
  }

  return Constants.one;
}
