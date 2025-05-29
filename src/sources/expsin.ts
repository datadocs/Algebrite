import { cadr, Constants, U } from '../runtime/defs.js';
import { exponential } from '../sources/misc.js';
import { subtract } from './add.js';
import { rational } from './bignum.js';
import { Eval } from './eval.js';
import { divide, multiply, negate } from './multiply.js';

// Do the exponential sine function.
export function Eval_expsin(p1: U) {
  return expsin(Eval(cadr(p1)));
}

export function expsin(p1: U): U {
  return subtract(
    multiply(
      divide(
        exponential(multiply(Constants.imaginaryunit, p1)),
        Constants.imaginaryunit
      ),
      rational(1, 2)
    ),
    multiply(
      divide(
        exponential(multiply(negate(Constants.imaginaryunit), p1)),
        Constants.imaginaryunit
      ),
      rational(1, 2)
    )
  );
}
