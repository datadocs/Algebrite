import { car, cdr, Constants, NIL, TAYLOR, U } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';
import { add, subtract } from './add.js';
import { integer, nativeInt } from './bignum.js';
import { derivative } from './derivative.js';
import { Eval } from './eval.js';
import { factorial } from './factorial.js';
import { guess } from './guess.js';
import { isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';
import { divide, multiply } from './multiply.js';
import { subst } from './subst.js';

/*
Taylor expansion of a function

  push(F)
  push(X)
  push(N)
  push(A)
  taylor()
*/
export function Eval_taylor(p1: U) {
  // 1st arg
  p1 = cdr(p1);
  const F = Eval(car(p1));

  // 2nd arg
  p1 = cdr(p1);
  let p2 = Eval(car(p1));
  const X = p2 === symbol(NIL) ? guess(F) : p2;

  // 3rd arg
  p1 = cdr(p1);
  p2 = Eval(car(p1));
  const N = p2 === symbol(NIL) ? integer(24) : p2; // 24: default number of terms

  // 4th arg
  p1 = cdr(p1);
  p2 = Eval(car(p1));
  const A = p2 === symbol(NIL) ? Constants.zero : p2; // 0: default expansion point

  return taylor(F, X, N, A);
}

function taylor(F: U, X: U, N: U, A: U): U {
  const k = nativeInt(N);
  if (isNaN(k)) {
    return makeList(symbol(TAYLOR), F, X, N, A);
  }

  let p5: U = Constants.one;
  let temp = Eval(subst(F, X, A)); // F: f(a)
  for (let i = 1; i <= k; i++) {
    F = derivative(F, X); // F: f = f'

    if (isZeroAtomOrTensor(F)) {
      break;
    }

    // c = c * (x - a)
    p5 = multiply(p5, subtract(X, A));

    const arg1a = Eval(subst(F, X, A)); // F: f(a)
    temp = add(temp, divide(multiply(arg1a, p5), factorial(integer(i))));
  }
  return temp;
}
