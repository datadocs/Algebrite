import { caddddr, cadddr, caddr, cadr, issymbol, NIL, U } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { get_binding, set_binding, symbol } from '../runtime/symbol.js';
import { integer, nativeInt } from './bignum.js';
import { Eval, evaluate_integer } from './eval.js';

// 'for' function

/*
x=0
y=2
for(do(x=sqrt(2+x),y=2*y/x),k,1,9)
float(y)

X: k
B: 1...9

1st parameter is the body
2nd parameter is the variable to loop with
3rd and 4th are the limits

*/

//define A p3
//define B p4
//define I p5
//define X p6
export function Eval_for(p1: U) {
  const loopingVariable = caddr(p1);
  if (!issymbol(loopingVariable)) {
    stop('for: 2nd arg should be the variable to loop over');
  }

  const j = evaluate_integer(cadddr(p1));
  if (isNaN(j)) {
    return p1;
  }

  const k = evaluate_integer(caddddr(p1));
  if (isNaN(k)) {
    return p1;
  }

  // remember contents of the index
  // variable so we can put it back after the loop
  const p4: U = get_binding(loopingVariable);

  for (let i = j; i <= k; i++) {
    set_binding(loopingVariable, integer(i));
    Eval(cadr(p1));
  }

  // put back the index variable to original content
  set_binding(loopingVariable, p4);

  // return value

  return symbol(NIL);
}
