import { Cons, NIL, U } from '../runtime/defs.js';
import { symbol } from '../runtime/symbol.js';

// Convert an array into a CONS list.
// TODO: rename this to just list
export function makeList(...items: U[]): U {
  let node: U = symbol(NIL);
  for (let i = items.length - 1; i >= 0; i--) {
    node = new Cons(items[i], node);
  }
  return node;
}
