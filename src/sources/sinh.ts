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

//            exp(x) - exp(-x)
//  sinh(x) = ----------------
//                   2
export function Eval_sinh(p1: U) {
  return ysinh(Eval(cadr(p1)));
}

export function ysinh(p1: U): U {
  if (car(p1) === symbol(ARCSINH)) {
    return cadr(p1);
  }
  if (isdouble(p1)) {
    let d = Math.sinh(p1.d);
    if (Math.abs(d) < 1e-10) {
      d = 0.0;
    }
    return double(d);
  }
  if (isZeroAtomOrTensor(p1)) {
    return Constants.zero;
  }
  return makeList(symbol(SINH), p1);
}
