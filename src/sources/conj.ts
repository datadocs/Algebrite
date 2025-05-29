import { cadr, Constants, U } from '../runtime/defs.js';
import { Find } from '../runtime/find.js';
import { clockform } from './clock.js';
import { Eval } from './eval.js';
import { negate } from './multiply.js';
import { polar } from './polar.js';
import { subst } from './subst.js';

/* conj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
z

General description
-------------------
Returns the complex conjugate of z.

*/
export function Eval_conj(p1: U) {
  p1 = Eval(cadr(p1));
  if (!Find(p1, Constants.imaginaryunit)) {
    // example: (-1)^(1/3)
    return clockform(conjugate(polar(p1)));
  } else {
    return conjugate(p1);
  }
}

// careful is you pass this one an expression with
// i (instead of (-1)^(1/2)) then this doesn't work!
export function conjugate(p1: U): U {
  return Eval(
    subst(p1, Constants.imaginaryunit, negate(Constants.imaginaryunit))
  );
}
