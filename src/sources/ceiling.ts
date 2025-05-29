import {
  cadr,
  CEILING,
  Constants,
  isdouble,
  isNumericAtom,
  Num,
  U
} from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { add } from './add.js';
import { double } from './bignum.js';
import { Eval } from './eval.js';
import { isinteger, isnegativenumber } from './is.js';
import { makeList } from './list.js';
import { mdiv } from './mmul.js';

/* ceiling =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------

Returns the smallest integer not less than x.

*/
export function Eval_ceiling(p1: U) {
  return ceiling(Eval(cadr(p1)));
}

function ceiling(p1: U): U {
  return yyceiling(p1);
}

function yyceiling(p1: U): U {
  if (!isNumericAtom(p1)) {
    return makeList(symbol(CEILING), p1);
  }

  if (isdouble(p1)) {
    return double(Math.ceil(p1.d));
  }

  if (isinteger(p1)) {
    return p1;
  }

  let result: U = new Num(mdiv(p1.q.a, p1.q.b));
  if (!isnegativenumber(p1)) {
    result = add(result, Constants.one);
  }
  return result;
}
