import { cadr, Constants, evalPolar, U } from '../runtime/defs.js';
import { exponential } from '../sources/misc.js';
import { abs } from './abs.js';
import { arg } from './arg.js';
import { Eval } from './eval.js';
import { multiply } from './multiply.js';

/*
Convert complex z to polar form

  Input:    p1  z
  Output:    Result

  polar(z) = abs(z) * exp(i * arg(z))
*/
export function Eval_polar(p1: U) {
  return polar(Eval(cadr(p1)));
}

export function polar(p1: U): U {
  // there are points where we turn polar
  // representations into rect, we set a "stack flag"
  // here to avoid that, so we don't undo the
  // work that we are trying to do.
  return evalPolar(() => {
    return multiply(
      abs(p1),
      exponential(multiply(Constants.imaginaryunit, arg(p1)))
    );
  });
}
