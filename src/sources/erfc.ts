import { cadr, Constants, ERFC, isdouble, U } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { double } from './bignum.js';
import { Eval } from './eval.js';
import { isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';

//-----------------------------------------------------------------------------
//
//  Author : philippe.billet@noos.fr
//
//  erfc(x)
//
//  GW  Added erfc() from Numerical Recipes in C
//
//-----------------------------------------------------------------------------
export function Eval_erfc(p1: U) {
  return yerfc(Eval(cadr(p1)));
}

function yerfc(p1: U): U {
  if (isdouble(p1)) {
    const d = erfc(p1.d);
    return double(d);
  }

  if (isZeroAtomOrTensor(p1)) {
    return Constants.one;
  }

  return makeList(symbol(ERFC), p1);
}

// from Numerical Recipes in C
export function erfc(x: number) {
  if (x === 0) {
    return 1.0;
  }

  const z = Math.abs(x);
  const t = 1.0 / (1.0 + 0.5 * z);

  const ans =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    );

  if (x >= 0.0) {
    return ans;
  }

  return 2.0 - ans;
}
