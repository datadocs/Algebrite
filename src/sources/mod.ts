import { caddr, cadr, isdouble, isNumericAtom, MOD, Num, U } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { symbol } from '../runtime/symbol.js';
import { integer, nativeInt } from './bignum.js';
import { Eval } from './eval.js';
import { isinteger, isZeroAtomOrTensor } from './is.js';
import { makeList } from './list.js';
import { mmod } from './mmul.js';

export function Eval_mod(p1: U) {
  const arg1 = Eval(cadr(p1));
  let arg2 = Eval(caddr(p1));
  return mod(arg1, arg2);
}

function mod(p1: U, p2: U): U {
  if (isZeroAtomOrTensor(p2)) {
    stop('mod function: divide by zero');
  }

  if (!isNumericAtom(p1) || !isNumericAtom(p2)) {
    return makeList(symbol(MOD), p1, p2);
  }

  if (isdouble(p1)) {
    const n = nativeInt(p1);
    if (isNaN(n)) {
      stop('mod function: cannot convert float value to integer');
    }
    p1 = integer(n);
  }

  if (isdouble(p2)) {
    const n = nativeInt(p2);
    if (isNaN(n)) {
      stop('mod function: cannot convert float value to integer');
    }
    p2 = integer(n);
  }

  if (!isinteger(p1) || !isinteger(p2)) {
    stop('mod function: integer arguments expected');
  }

  return new Num(mmod(p1.q.a, p2.q.a));
}
