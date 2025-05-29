import {
  cadr,
  Constants,
  FLOOR,
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

export function Eval_floor(p1: U) {
  return yfloor(Eval(cadr(p1)));
}

function yfloor(p1: U): U {
  return yyfloor(p1);
}

function yyfloor(p1: U): U {
  if (!isNumericAtom(p1)) {
    return makeList(symbol(FLOOR), p1);
  }

  if (isdouble(p1)) {
    return double(Math.floor(p1.d));
  }

  if (isinteger(p1)) {
    return p1;
  }

  let p3: U = new Num(mdiv(p1.q.a, p1.q.b));

  if (isnegativenumber(p1)) {
    p3 = add(p3, Constants.negOne);
  }
  return p3;
}
