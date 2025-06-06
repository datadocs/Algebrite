import {
  caddr,
  cadr,
  Constants,
  E,
  isdouble,
  ismultiply,
  ispower,
  LOG,
  U
} from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { add, subtract } from './add.js';
import { double } from './bignum.js';
import { denominator } from './denominator.js';
import { Eval } from './eval.js';
import { equaln, isfraction, isnegativenumber } from './is.js';
import { makeList } from './list.js';
import { multiply, negate } from './multiply.js';
import { numerator } from './numerator.js';

// Natural logarithm.
//
// Note that we use the mathematics / Javascript / Mathematica
// convention that "log" is indeed the natural logarithm.
//
// In engineering, biology, astronomy, "log" can stand instead
// for the "common" logarithm i.e. base 10. Also note that Google
// calculations use log for the common logarithm.
export function Eval_log(p1: U) {
  return logarithm(Eval(cadr(p1)));
}

export function logarithm(p1: U): U {
  if (p1 === symbol(E)) {
    return Constants.one;
  }

  if (equaln(p1, 1)) {
    return Constants.zero;
  }

  if (isnegativenumber(p1)) {
    return add(logarithm(negate(p1)), multiply(Constants.imaginaryunit, Constants.Pi()));
  }

  if (isdouble(p1)) {
    return double(Math.log(p1.d));
  }

  // rational number and not an integer?
  if (isfraction(p1)) {
    return subtract(logarithm(numerator(p1)), logarithm(denominator(p1)));
  }

  // log(a ^ b) --> b log(a)
  if (ispower(p1)) {
    return multiply(caddr(p1), logarithm(cadr(p1)));
  }

  // log(a * b) --> log(a) + log(b)
  if (ismultiply(p1)) {
    return p1.tail().map(logarithm).reduce(add, Constants.zero);
  }

  return makeList(symbol(LOG), p1);
}
