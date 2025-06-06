import { ARCTAN, cadr, car, Constants, isdouble, TAN, U } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { double, integer, nativeInt, rational } from './bignum.js';
import { Eval } from './eval.js';
import { isnegative } from './is.js';
import { makeList } from './list.js';
import { divide, multiply, negate } from './multiply.js';
import { power } from './power.js';

// Tangent function of numerical and symbolic arguments
export function Eval_tan(p1: U) {
  return tangent(Eval(cadr(p1)));
}

function tangent(p1: U): U {
  if (car(p1) === symbol(ARCTAN)) {
    return cadr(p1);
  }

  if (isdouble(p1)) {
    let d = Math.tan(p1.d);
    if (Math.abs(d) < 1e-10) {
      d = 0.0;
    }
    return double(d);
  }

  // tan function is antisymmetric, tan(-x) = -tan(x)
  if (isnegative(p1)) {
    return negate(tangent(negate(p1)));
  }

  // multiply by 180/pi to go from radians to degrees.
  // we go from radians to degrees because it's much
  // easier to calculate symbolic results of most (not all) "classic"
  // angles (e.g. 30,45,60...) if we calculate the degrees
  // and the we do a switch on that.
  // Alternatively, we could look at the fraction of pi
  // (e.g. 60 degrees is 1/3 pi) but that's more
  // convoluted as we'd need to look at both numerator and
  // denominator.
  const n = nativeInt(divide(multiply(p1, integer(180)), Constants.Pi()));

  // most "good" (i.e. compact) trigonometric results
  // happen for a round number of degrees. There are some exceptions
  // though, e.g. 22.5 degrees, which we don't capture here.
  if (n < 0 || isNaN(n)) {
    return makeList(symbol(TAN), p1);
  }

  switch (n % 360) {
    case 0:
    case 180:
      return Constants.zero;
    case 30:
    case 210:
      return multiply(rational(1, 3), power(integer(3), rational(1, 2)));
    case 150:
    case 330:
      return multiply(rational(-1, 3), power(integer(3), rational(1, 2)));
    case 45:
    case 225:
      return Constants.one;
    case 135:
    case 315:
      return Constants.negOne;
    case 60:
    case 240:
      return power(integer(3), rational(1, 2));
    case 120:
    case 300:
      return negate(power(integer(3), rational(1, 2)));
    default:
      return makeList(symbol(TAN), p1);
  }
}
