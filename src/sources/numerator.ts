import {
  caddr,
  cadr,
  car,
  cdr,
  Constants,
  isadd,
  ismultiply,
  ispower,
  isrational,
  U
} from '../runtime/defs.js';
import { mp_numerator } from './bignum.js';
import { Eval } from './eval.js';
import { isnegativeterm, isplusone } from './is.js';
import { multiply_all } from './multiply.js';
import { rationalize } from './rationalize.js';

export function Eval_numerator(p1: U) {
  return numerator(Eval(cadr(p1)));
}

export function numerator(p1: U): U {
  if (isadd(p1)) {
    //console.trace "rationalising "
    p1 = rationalize(p1);
  }
  //console.log "rationalised: " + p1

  if (ismultiply(p1) && !isplusone(car(cdr(p1)))) {
    //console.log "p1 inside multiply: " + p1
    //console.log "first term: " + car(p1)
    return multiply_all(p1.tail().map(numerator));
  }

  if (isrational(p1)) {
    return mp_numerator(p1);
  }

  if (ispower(p1) && isnegativeterm(caddr(p1))) {
    return Constants.one;
  }

  return p1;
}
