import { alloc_tensor } from '../runtime/alloc.js';
import { cadr, U } from '../runtime/defs.js';
import { stop } from '../runtime/run.js';
import { cofactor } from './cofactor.js';
import { Eval } from './eval.js';
import { is_square_matrix } from './tensor.js';

/* adj =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
m

General description
-------------------
Returns the adjunct of matrix m. The inverse of m is equal to adj(m) divided by det(m).

*/
export function Eval_adj(p1: U) {
  return adj(Eval(cadr(p1)));
}

export function adj(p1: U): U {
  if (!is_square_matrix(p1)) {
    stop('adj: square matrix expected');
  }

  const n = p1.tensor.dim[0];

  const p2 = alloc_tensor(n * n);

  p2.tensor.ndim = 2;
  p2.tensor.dim[0] = n;
  p2.tensor.dim[1] = n;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      p2.tensor.elem[n * j + i] = cofactor(p1, n, i, j);
    }
  } // transpose

  return p2;
}
