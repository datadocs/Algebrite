import {
  ARCCOSH,
  cadr,
  car,
  Constants,
  COSH,
  isdouble,
  U
} from '../runtime/defs.js';
import { symbol } from "../runtime/symbol.js";
import { double } from './bignum.js';
import { Eval } from './eval.js';
import { isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';

/* cosh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the hyperbolic cosine of x

```
            exp(x) + exp(-x)
  cosh(x) = ----------------
                   2
```

*/
export function Eval_cosh(p1: U) {
  return ycosh(Eval(cadr(p1)));
}

export function ycosh(p1: U): U {
  if (car(p1) === symbol(ARCCOSH)) {
    return cadr(p1);
  }
  if (isdouble(p1)) {
    let d = Math.cosh(p1.d);
    if (Math.abs(d) < 1e-10) {
      d = 0.0;
    }
    return double(d);
  }
  if (isZeroAtomOrTensor(p1)) {
    return Constants.one;
  }
  return makeList(symbol(COSH), p1);
}
