import {
  cadr,
  Double,
  isdouble,
  isNumericAtom,
  ROUND,
  U
} from '../runtime/defs.js';
import { symbol } from "../runtime/symbol.js";
import { double, integer } from './bignum.js';
import { Eval } from './eval.js';
import { yyfloat } from './float.js';
import { isinteger } from './is.js';
import { makeList } from './list.js';

export function Eval_round(p1: U) {
  return yround(Eval(cadr(p1)));
}

function yround(p1: U): U {
  if (!isNumericAtom(p1)) {
    return makeList(symbol(ROUND), p1);
  }

  if (isdouble(p1)) {
    return double(Math.round(p1.d));
  }

  if (isinteger(p1)) {
    return p1;
  }

  p1 = yyfloat(p1) as Double;
  return integer(Math.round(p1.d));
}
