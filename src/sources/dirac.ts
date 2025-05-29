import {
  cadr,
  Constants,
  DIRAC,
  isadd,
  isdouble,
  ispower,
  isrational,
  MZERO,
  U
} from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { Eval } from './eval.js';
import { isnegativeterm } from './is.js';
import { makeList } from './list.js';
import { mmul } from './mmul.js';
import { negate } from './multiply.js';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  Dirac function dirac(x)
//  dirac(-x)=dirac(x)
//  dirac(b-a)=dirac(a-b)
//-----------------------------------------------------------------------------
export function Eval_dirac(p1: U) {
  return dirac(Eval(cadr(p1)));
}

export function dirac(p1: U): U {
  return ydirac(p1);
}

function ydirac(p1: U): U {
  if (isdouble(p1)) {
    if (p1.d === 0) {
      return Constants.one;
    }
    return Constants.zero;
  }

  if (isrational(p1)) {
    if (MZERO(mmul(p1.q.a, p1.q.b))) {
      return Constants.one;
    }
    return Constants.zero;
  }

  if (ispower(p1)) {
    return makeList(symbol(DIRAC), cadr(p1));
  }

  if (isnegativeterm(p1)) {
    return makeList(symbol(DIRAC), negate(p1));
  }

  if (isnegativeterm(p1) || (isadd(p1) && isnegativeterm(cadr(p1)))) {
    p1 = negate(p1);
  }

  return makeList(symbol(DIRAC), p1);
}
