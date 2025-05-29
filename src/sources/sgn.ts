import {
  cadr,
  Constants,
  isdouble,
  isrational,
  MSIGN,
  MZERO,
  SGN,
  U
} from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { absval } from './abs.js';
import { Eval } from './eval.js';
import { iscomplexnumber, isnegativeterm } from './is.js';
import { makeList } from './list.js';
import { mmul } from './mmul.js';
import { multiply, negate } from './multiply.js';
import { power } from './power.js';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  sgn sign function
//
//
//-----------------------------------------------------------------------------
export function Eval_sgn(p1: U) {
  return sgn(Eval(cadr(p1)));
}

export function sgn(X: U): U {
  if (isdouble(X)) {
    if (X.d > 0) {
      return Constants.one;
    }
    if (X.d === 0) {
      return Constants.one;
    }
    return Constants.negOne;
  }

  if (isrational(X)) {
    if (MSIGN(mmul(X.q.a, X.q.b)) === -1) {
      return Constants.negOne;
    }
    if (MZERO(mmul(X.q.a, X.q.b))) {
      return Constants.zero;
    }
    return Constants.one;
  }

  if (iscomplexnumber(X)) {
    return multiply(power(Constants.negOne, absval(X)), X);
  }

  if (isnegativeterm(X)) {
    return multiply(makeList(symbol(SGN), negate(X)), Constants.negOne);
  }

  return makeList(symbol(SGN), X);
}
