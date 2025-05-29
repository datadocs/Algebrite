import { cadddr, caddr, cadr, Constants, NIL, SYMBOL_X, U } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { add, subtract } from './add.js';
import { integer } from './bignum.js';
import { coeff } from './coeff.js';
import { Eval } from './eval.js';
import { divide, multiply } from './multiply.js';
import { power } from './power.js';

// Divide polynomials
export function Eval_quotient(p1: U) {
  const DIVIDEND = Eval(cadr(p1)); // 1st arg, p(x)
  const DIVISOR = Eval(caddr(p1)); // 2nd arg, q(x)
  let X = Eval(cadddr(p1)); // 3rd arg, x, default x
  if (X === symbol(NIL)) {
    X = symbol(SYMBOL_X);
  }
  return divpoly(DIVIDEND, DIVISOR, X);
}

//-----------------------------------------------------------------------------
//
//  Divide polynomials
//
//  Input:    Dividend
//            Divisor
//            x
//
//  Output:    Quotient
//
//-----------------------------------------------------------------------------
export function divpoly(DIVIDEND: U, DIVISOR: U, X: U): U {
  const dividendCs = coeff(DIVIDEND, X);
  let m = dividendCs.length - 1; // m is dividend's power

  const divisorCs = coeff(DIVISOR, X);
  const n = divisorCs.length - 1; // n is divisor's power

  let x = m - n;

  let QUOTIENT: U = Constants.zero;
  while (x >= 0) {
    const Q = divide(dividendCs[m], divisorCs[n]);

    for (let i = 0; i <= n; i++) {
      dividendCs[x + i] = subtract(dividendCs[x + i], multiply(divisorCs[i], Q));
    }

    QUOTIENT = add(QUOTIENT, multiply(Q, power(X, integer(x))));

    m--;
    x--;
  }

  return QUOTIENT;
}
