import { index_function, set_component } from './index.js';
import { alloc_tensor } from '../runtime/alloc.js';
import {
  breakpoint,
  caadr,
  cadadr,
  cadddr,
  caddr,
  cadr,
  car,
  cdadr,
  cddr,
  cdr,
  CONS,
  Cons,
  Constants,
  DEBUG,
  defs,
  DOUBLE,
  EVAL,
  INDEX,
  iscons,
  isdouble,
  ISINTEGER,
  isNumericAtom,
  isrational,
  issymbol,
  istensor,
  LAST,
  NIL,
  noexpand,
  NUM,
  OPERATOR,
  PI,
  SETQ,
  STR,
  SYM,
  Sym,
  TENSOR,
  Tensor,
  TESTEQ,
  U
} from '../runtime/defs.js';
import { check_esc_flag, stop } from '../runtime/run.js';
import { get_binding, iskeyword, set_binding, symbol } from '../runtime/symbol.js';
import {
  convert_rational_to_double,
  double,
  integer,
  nativeInt,
  rational
} from './bignum.js';
import { define_user_function } from './define.js';
import { det } from './det.js';
import { divisors } from './divisors.js';
import { factorial } from './factorial.js';
import { factorpoly } from './factorpoly.js';
import { hermite } from './hermite.js';
import { hilbert } from './hilbert.js';
import { inv, invg } from './inv.js';
import {
  isfloating,
  isinteger,
  isintegerorintegerfloat,
  isZeroLikeOrNonZeroLikeOrUndetermined
} from './is.js';
import { makeList } from './list.js';
import { exponential } from './misc.js';
import { power } from './power.js';
import { subst } from './subst.js';
import { check_tensor_dimensions, Eval_tensor } from './tensor.js';
import { Eval_user_function } from './userfunc.js';

export function evaluate_integer(p: U): number {
  return nativeInt(Eval(p));
}

// Evaluate an expression, for example...
//
//  push(p1)
//  Eval()
//  p2 = pop()
export function Eval(p1: U): U {
  let willEvaluateAsFloats: boolean;
  check_esc_flag();
  if (p1 == null) {
    breakpoint;
  }

  if (!defs.evaluatingAsFloats && isfloating(p1)) {
    willEvaluateAsFloats = true;
    defs.evaluatingAsFloats = true;
  }

  try {
    switch (p1.k) {
      case CONS:
        return Eval_cons(p1);
      case NUM:
        return defs.evaluatingAsFloats ? double(convert_rational_to_double(p1)) : p1;
      case DOUBLE:
      case STR:
        return p1;
      case TENSOR:
        return Eval_tensor(p1);
      case SYM:
        return Eval_sym(p1);
      default:
        stop('atom?');
    }
  } finally {
    if (willEvaluateAsFloats) {
      defs.evaluatingAsFloats = false;
    }
  }
}

export function Eval_sym(p1: Sym): U {
  // note that function calls are not processed here
  // because, since they have an argument (at least an empty one)
  // they are actually CONs, which is a branch of the
  // switch before the one that calls this function

  // bare keyword?
  // If it's a keyword, then we don't look
  // at the binding array, because keywords
  // are not redefinable.
  if (iskeyword(p1)) {
    return Eval(makeList(p1, symbol(LAST)));
  } else if (p1 === symbol(PI) && defs.evaluatingAsFloats) {
    return Constants.piAsDouble;
  }

  // Evaluate symbol's binding
  let p2 = get_binding(p1);
  if (DEBUG) {
    console.log(`looked up: ${p1} which contains: ${p2}`);
  }

  // differently from standard Lisp,
  // here the evaluation is not
  // one-step only, rather it keeps evaluating
  // "all the way" until a symbol is
  // defined as itself.
  // Uncomment these two lines to get Lisp
  // behaviour (and break most tests)
  if (p1 !== p2) {
    // detect recursive lookup of symbols, which would otherwise
    // cause a stack overflow.
    // Note that recursive functions will still work because
    // as mentioned at the top, this method doesn't look
    // up and evaluate function calls.
    const positionIfSymbolAlreadyBeingEvaluated =
      defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.indexOf(p1);
    if (positionIfSymbolAlreadyBeingEvaluated !== -1) {
      let cycleString = '';
      for (
        let i = positionIfSymbolAlreadyBeingEvaluated;
        i < defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.length;
        i++
      ) {
        cycleString +=
          defs.chainOfUserSymbolsNotFunctionsBeingEvaluated[i].printname + ' -> ';
      }
      cycleString += p1.printname;

      stop('recursive evaluation of symbols: ' + cycleString);
      return;
    }

    defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.push(p1);

    p2 = Eval(p2);

    defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.pop();
  }
  return p2;
}

export function Eval_cons(p1: Cons): U {
  const cons_head = car(p1);

  // normally the cons_head is a symbol,
  // but sometimes in the case of
  // functions we don't have a symbol,
  // we have to evaluate something to get to the
  // symbol. For example if a function is inside
  // a tensor, then we need to evaluate an index
  // access first to get to the function.
  // In those cases, we find an EVAL here,
  // so we proceed to EVAL
  if (car(cons_head) === symbol(EVAL)) {
    return Eval_user_function(p1);
  }

  // If we didn't fall in the EVAL case above
  // then at this point we must have a symbol.
  if (!issymbol(cons_head)) {
    stop('cons?');
  }

  if (cons_head.keyword) {
    return cons_head.keyword(p1);
  }

  return Eval_user_function(p1);
}

export function Eval_binding(p1: U) {
  return get_binding(cadr(p1));
}

/* check =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
p

General description
-------------------
Returns whether the predicate p is true/false or unknown:
0 if false, 1 if true or remains unevaluated if unknown.
Note that if "check" is passed an assignment, it turns it into a test,
i.e. check(a = b) is turned into check(a==b) 
so "a" is not assigned anything.
Like in many programming languages, "check" also gives truthyness/falsyness
for numeric values. In which case, "true" is returned for non-zero values.
Potential improvements: "check" can't evaluate strings yet.

*/
export function Eval_check(p1: U) {
  // check the argument
  const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(cadr(p1));

  if (checkResult == null) {
    // returned null: unknown result
    // leave the whole check unevalled
    return p1;
  } else {
    // returned true or false -> 1 or 0
    return integer(Number(checkResult));
  }
}

export function Eval_det(p1: U) {
  const arg = Eval(cadr(p1)) as Tensor;
  return det(arg);
}

/* dim =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
m,n

General description
-------------------
Returns the cardinality of the nth index of tensor "m".

*/
export function Eval_dim(p1: U) {
  //int n
  const p2 = Eval(cadr(p1));
  const n = iscons(cddr(p1)) ? evaluate_integer(caddr(p1)) : 1;
  if (!istensor(p2)) {
    return Constants.one; // dim of scalar is 1
  } else if (n < 1 || n > p2.tensor.ndim) {
    return p1;
  } else {
    return integer(p2.tensor.dim[n - 1]);
  }
}

export function Eval_divisors(p1: U) {
  return divisors(Eval(cadr(p1)));
}

/* do =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
a,b,...

General description
-------------------
Evaluates each argument from left to right. Returns the result of the last argument.

*/
export function Eval_do(p1: U) {
  let result = car(p1);
  p1 = cdr(p1);

  while (iscons(p1)) {
    result = Eval(car(p1));
    p1 = cdr(p1);
  }
  return result;
}

export function Eval_dsolve(p1: U) {
  const a = Eval(cadr(p1));
  const b = Eval(caddr(p1));
  const c = Eval(cadddr(p1));
  stop('dsolve');
  //return dsolve(a, b, c);
}

// for example, Eval(f,x,2)

export function Eval_Eval(p1: U) {
  let tmp = Eval(cadr(p1));
  p1 = cddr(p1);
  while (iscons(p1)) {
    tmp = subst(tmp, Eval(car(p1)), Eval(cadr(p1)));
    p1 = cddr(p1);
  }
  return Eval(tmp);
}

// exp evaluation: it replaces itself with
// a POWER(E,something) node and evals that one
export function Eval_exp(p1: U) {
  return exponential(Eval(cadr(p1)));
}

export function Eval_factorial(p1: U) {
  return factorial(Eval(cadr(p1)));
}

export function Eval_factorpoly(p1: U): U {
  p1 = cdr(p1);
  const arg1 = Eval(car(p1));
  p1 = cdr(p1);
  const arg2 = Eval(car(p1));
  let temp = factorpoly(arg1, arg2);
  if (iscons(p1)) {
    temp = p1.tail().reduce((a: U, b: U) => factorpoly(a, Eval(b)), temp);
  }
  return temp;
}

export function Eval_hermite(p1: U) {
  const arg2 = Eval(caddr(p1));
  const arg1 = Eval(cadr(p1));
  return hermite(arg1, arg2);
}

export function Eval_hilbert(p1: U) {
  return hilbert(Eval(cadr(p1)));
}

export function Eval_index(p1: U) {
  const orig = p1;

  // look into the head of the list,
  // when evaluated it should be a tensor
  p1 = cdr(p1);
  const theTensor = Eval(car(p1));

  if (isNumericAtom(theTensor)) {
    stop('trying to access a scalar as a tensor');
  }

  if (!istensor(theTensor)) {
    // the tensor is not allocated yet, so
    // leaving the expression unevalled
    return orig;
  }

  const stack: U[] = [];
  // we examined the head of the list which was the tensor,
  // now look into the indexes
  p1 = cdr(p1);
  while (iscons(p1)) {
    stack.push(Eval(car(p1)));
    if (!isintegerorintegerfloat(stack[stack.length - 1])) {
      // index with something other than an integer
      return orig;
    }
    p1 = cdr(p1);
  }

  return index_function(theTensor, stack);
}

export function Eval_inv(p1: U) {
  const arg = Eval(cadr(p1));
  return inv(arg);
}

export function Eval_invg(p1: U) {
  const arg = Eval(cadr(p1));
  return invg(arg);
}

export function Eval_isinteger(p1: U) {
  p1 = Eval(cadr(p1));
  if (isrational(p1)) {
    return isinteger(p1) ? Constants.one : Constants.zero;
  }
  if (isdouble(p1)) {
    const n = Math.floor(p1.d);
    return n === p1.d ? Constants.one : Constants.zero;
  }
  return makeList(symbol(ISINTEGER), p1);
}

export function Eval_number(p1: U) {
  p1 = Eval(cadr(p1));
  if (p1.k === NUM || p1.k === DOUBLE) {
    return Constants.one;
  } else {
    return Constants.zero;
  }
}

export function Eval_operator(p1: U) {
  return makeList(symbol(OPERATOR), ...evalList(cdr(p1)));
}

// quote definition
export function Eval_quote(p1: U) {
  return cadr(p1);
}

// rank definition
export function Eval_rank(p1: U) {
  p1 = Eval(cadr(p1));
  if (istensor(p1)) {
    return integer(p1.tensor.ndim);
  } else {
    return Constants.zero;
  }
}

// Evaluates the right side and assigns the
// result of the evaluation to the left side.
// It's called setq because it stands for "set quoted" from Lisp,
// see:
//   http://stackoverflow.com/questions/869529/difference-between-set-setq-and-setf-in-common-lisp
// Note that this also takes case of assigning to a tensor
// element, which is something that setq wouldn't do
// in list, see comments further down below.

// Example:
//   f = x
//   // f evaluates to x, so x is assigned to g really
//   // rather than actually f being assigned to g
//   g = f
//   f = y
//   g
//   > x
export function Eval_setq(p1: U): U {
  // case of tensor
  if (caadr(p1) === symbol(INDEX)) {
    return setq_indexed(p1);
  }

  // case of function definition
  if (iscons(cadr(p1))) {
    return define_user_function(p1);
  }

  if (!issymbol(cadr(p1))) {
    stop('symbol assignment: error in symbol');
  }

  const p2 = Eval(caddr(p1));
  set_binding(cadr(p1), p2);

  // An assignment returns nothing.
  // This is unlike most programming languages
  // where an assignment does return the
  // assigned value.
  // TODO Could be changed.
  return symbol(NIL);
}

// Here "setq" is a misnomer because
// setq wouldn't work in Lisp to set array elements
// since setq stands for "set quoted" and you wouldn't
// quote an array element access.
// You'd rather use setf, which is a macro that can
// assign a value to anything.
//   (setf (aref YourArray 2) "blue")
// see
//   http://stackoverflow.com/questions/18062016/common-lisp-how-to-set-an-element-in-a-2d-array
//-----------------------------------------------------------------------------
//
//  Example: a[1] = b
//
//  p1  *-------*-----------------------*
//    |  |      |
//    setq  *-------*-------*  b
//      |  |  |
//      index  a  1
//
//  cadadr(p1) -> a
//
//-----------------------------------------------------------------------------
function setq_indexed(p1: U): U {
  const p4 = cadadr(p1);
  console.log(`p4: ${p4}`);
  if (!issymbol(p4)) {
    // this is likely to happen when one tries to
    // do assignments like these
    //   1[2] = 3
    // or
    //   f(x)[1] = 2
    // or
    //   [[1,2],[3,4]][5] = 6
    //
    // In other words, one can only do
    // a straight assignment like
    //   existingMatrix[index] = something
    stop('indexed assignment: expected a symbol name');
  }
  const lvalue = Eval(caddr(p1));
  let args: U[] = [];
  let p2 = cdadr(p1);
  if (iscons(p2)) {
    args = [...p2].map(Eval);
  }
  const p3 = set_component(lvalue, ...args);
  set_binding(p4, p3);
  return symbol(NIL);
}

export function Eval_sqrt(p1: U) {
  const base = Eval(cadr(p1));
  return power(base, rational(1, 2));
}

export function Eval_stop(): never {
  stop('user stop');
}

export function Eval_subst(p1: U) {
  const newExpr = Eval(cadr(p1));
  const oldExpr = Eval(caddr(p1));
  const expr = Eval(cadddr(p1));
  return Eval(subst(expr, oldExpr, newExpr));
}

// always returns a matrix with rank 2
// i.e. two dimensions,
// the passed parameter is the size
export function Eval_unit(p1: U) {
  const n = evaluate_integer(cadr(p1));

  if (isNaN(n)) {
    return p1;
  }

  if (n < 1) {
    return p1;
  }

  p1 = alloc_tensor(n * n);
  p1.tensor.ndim = 2;
  p1.tensor.dim[0] = n;
  p1.tensor.dim[1] = n;
  for (let i = 0; i < n; i++) {
    p1.tensor.elem[n * i + i] = Constants.one;
  }
  check_tensor_dimensions(p1);
  return p1;
}

// like Eval() except "=" (assignment) is treated
// as "==" (equality test)
// This is because
//  * this allows users to be lazy and just
//    use "=" instead of "==" as per more common
//    mathematical notation
//  * in many places we don't expect an assignment
//    e.g. we don't expect to test the zero-ness
//    of an assignment or the truth value of
//    an assignment
// Note that these are questionable assumptions
// as for example in most programming languages one
// can indeed test the value of an assignment (the
// value is just the evaluation of the right side)

export function Eval_predicate(p1: U): U {
  if (car(p1) === symbol(SETQ)) {
    // replace the assignment in the
    // head with an equality test
    p1 = makeList(symbol(TESTEQ), cadr(p1), caddr(p1));
  }

  return Eval(p1);
}

export function* evalList(p1: U) {
  if (iscons(p1)) {
    for (const el of p1) {
      yield Eval(el);
    }
  }
}
