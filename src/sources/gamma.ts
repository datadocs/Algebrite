import {
  cadr,
  car,
  cdr,
  Constants,
  GAMMA,
  isadd,
  isrational,
  MEQUAL,
  Num,
  U
} from '../runtime/defs.js';
import { symbol } from "../runtime/symbol.js";
import { add } from './add.js';
import { rational } from './bignum.js';
import { Eval } from './eval.js';
import { isnegativeterm } from './is.js';
import { makeList } from './list.js';
import { divide, multiply, negate } from './multiply.js';
import { power } from './power.js';
import { sine } from './sin.js';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  Gamma function gamma(x)
//
//-----------------------------------------------------------------------------
export function Eval_gamma(p1: U) {
  return gamma(Eval(cadr(p1)));
}

function gamma(p1: U): U {
  return gammaf(p1);
}

function gammaf(p1: U): U {
  if (isrational(p1) && MEQUAL(p1.q.a, 1) && MEQUAL(p1.q.b, 2)) {
    return power(Constants.Pi(), rational(1, 2));
  }

  if (isrational(p1) && MEQUAL(p1.q.a, 3) && MEQUAL(p1.q.b, 2)) {
    return multiply(power(Constants.Pi(), rational(1, 2)), rational(1, 2));
  }

  //  if (p1->k == DOUBLE) {
  //    d = exp(lgamma(p1.d))
  //    push_double(d)
  //    return
  //  }

  if (isnegativeterm(p1)) {
    return divide(
      multiply(Constants.Pi(), Constants.negOne),
      multiply(
        multiply(sine(multiply(Constants.Pi(), p1)), p1),
        gamma(negate(p1))
      )
    );
  }

  if (isadd(p1)) {
    return gamma_of_sum(p1);
  }

  return makeList(symbol(GAMMA), p1);
}

function gamma_of_sum(p1: U): U {
  const p3 = cdr(p1);
  if (
    isrational(car(p3)) &&
    MEQUAL((car(p3) as Num).q.a, 1) &&
    MEQUAL((car(p3) as Num).q.b, 1)
  ) {
    return multiply(cadr(p3), gamma(cadr(p3)));
  }

  if (
    isrational(car(p3)) &&
    MEQUAL((car(p3) as Num).q.a, -1) &&
    MEQUAL((car(p3) as Num).q.b, 1)
  ) {
    return divide(gamma(cadr(p3)), add(cadr(p3), Constants.negOne));
  }

  return makeList(symbol(GAMMA), p1);
}
