/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs:
 * https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import { BigInteger } from 'big-integer';
import {caaddr, caadr, caar, cadaddr, cadadr, cadar, caddaddr, caddadr, caddar, caddddr, cadddr, caddr, cadr, car, cdaddr, cdadr, cdar, cddaddr, cddar, cdddaddr, cddddr, cdddr, cddr, cdr, CONS, Cons, defs, DOUBLE, Double, isadd, iscons, isdouble, isfactorial, ismultiply, isNumericAtom, ispower, isrational, isstr, issymbol, istensor, NUM, Num, STR, Str, SYM, Sym, TENSOR, Tensor, U, version,} from './runtime/defs';
import {Find} from './runtime/find';
import {init} from './runtime/init';
import {run} from './runtime/run';
import {collectUserSymbols, get_binding, iskeyword, set_binding, symbol, usr_symbol,} from './runtime/symbol';
import {exec, parse} from './runtime/zombocom';
import {approxAll, approxRadicals, approxRationalsOfLogs, testApprox,} from './sources/approxratio';
import {make_hashed_itab} from './sources/integral';
import {iscomplexnumber, iseveninteger, isfloating, isfraction, isimaginarynumber, isimaginaryunit, isinteger, isintegerfactor, isminusone, isminusoneoversqrttwo, isnegative, isnegativenumber, isnegativeterm, isnonnegativeinteger, isnpi, isoneover, isoneoversqrttwo, isplusone, isposint, isquarterturn, issymbolic, isZeroAtomOrTensor,} from './sources/is';
import { equal, length } from './sources/misc';
import {scan} from './sources/scan';

const functions = {
  version,
  isadd,
  ismultiply,
  ispower,
  isfactorial,
  car,
  cdr,
  caar,
  cadr,
  cdar,
  cddr,
  caadr,
  caddr,
  cadar,
  cdadr,
  cddar,
  cdddr,
  caaddr,
  cadadr,
  caddar,
  cdaddr,
  cadddr,
  cddddr,
  caddddr,
  cadaddr,
  cddaddr,
  caddadr,
  cdddaddr,
  caddaddr,
  symbol,
  iscons,
  isrational,
  isdouble,
  isNumericAtom,
  isstr,
  istensor,
  issymbol,
  iskeyword,
  CONS,
  Cons,
  NUM,
  Num,
  DOUBLE,
  Double,
  STR,
  Str,
  TENSOR,
  Tensor,
  SYM,
  Sym,
  approxRadicals,
  approxRationalsOfLogs,
  approxAll,
  testApprox,
  make_hashed_itab,
  isZeroAtomOrTensor,
  isnegativenumber,
  isplusone,
  isminusone,
  isinteger,
  isnonnegativeinteger,
  isposint,
  isnegativeterm,
  isimaginarynumber,
  iscomplexnumber,
  iseveninteger,
  isnegative,
  issymbolic,
  isintegerfactor,
  isoneover,
  isfraction,
  isoneoversqrttwo,
  isminusoneoversqrttwo,
  isfloating,
  isimaginaryunit,
  isquarterturn,
  isnpi,
  equal,
  length,
  scan,
  Find,
  get_binding,
  set_binding,
  usr_symbol,
  collectUserSymbols,
  init,
  exec,
  parse,
  run,
};

const builtin_fns = [
  'abs',         'add',          'adj',          'and',
  'approxratio', 'arccos',       'arccosh',      'arcsin',
  'arcsinh',     'arctan',       'arctanh',      'arg',
  'atomize',     'besselj',      'bessely',      'binding',
  'binomial',    'ceiling',      'check',        'choose',
  'circexp',     'clear',        'clearall',     'clearpatterns',
  'clock',       'coeff',        'cofactor',     'condense',
  'conj',        'contract',     'cos',          'cosh',
  'decomp',      'defint',       'deg',          'denominator',
  'det',         'derivative',   'dim',          'dirac',
  'divisors',    'do',           'dot',          'draw',
  'dsolve',      'eigen',        'eigenval',     'eigenvec',
  'erf',         'erfc',         'eval',         'exp',
  'expand',      'expcos',       'expsin',       'factor',
  'factorial',   'factorpoly',   'filter',       'float',
  'floor',       'for',          'Gamma',        'gcd',
  'hermite',     'hilbert',      'imag',         'component',
  'inner',       'integral',     'inv',          'invg',
  'isinteger',   'isprime',      'laguerre',     'lcm',
  'leading',     'legendre',     'log',          'mod',
  'multiply',    'not',          'nroots',       'number',
  'numerator',   'operator',     'or',           'outer',
  'pattern',     'patternsinfo', 'polar',        'power',
  'prime',       'print',        'print2dascii', 'printcomputer',
  'printlatex',  'printlist',    'printhuman',   'product',
  'quote',       'quotient',     'rank',         'rationalize',
  'real',        'rect',         'roots',        'round',
  'equals',      'shape',        'sgn',          'silentpattern',
  'simplify',    'sin',          'sinh',         'sqrt',
  'stop',        'subst',        'sum',          'symbolsinfo',
  'tan',         'tanh',         'taylor',       'test',
  'testeq',      'testge',       'testgt',       'testle',
  'testlt',      'transpose',    'unit',         'zero',
];

type builtInKeys = 'abs'|'add'|'adj'|'and'|
     'approxratio'|'arccos'|'arccosh'|'arcsin'|'arcsinh'|'arctan'|'arctanh'|
    'arg'|'atomize'|'besselj'|'bessely'|'binding'|'binomial'|'ceiling'|'check'|
    'choose'|'circexp'|'clear'|'clearall'|'clearpatterns'|'clock'|'coeff'|
    'cofactor'|'condense'|'conj'|'contract'|'cos'|'cosh'|'decomp'|'defint'|
    'deg'|'denominator'|'det'|'derivative'|'dim'|'dirac'|'divisors'|'do'|'dot'|
    'draw'|'dsolve'|'eigen'|'eigenval'|'eigenvec'|'erf'|'erfc'|'eval'|'exp'|
    'expand'|'expcos'|'expsin'|'factor'|'factorial'|'factorpoly'|'filter'|
    'float'|'floor'|'for'|'Gamma'|'gcd'|'hermite'|'hilbert'|'imag'|'component'|
    'inner'|'integral'|'inv'|'invg'|'isinteger'|'isprime'|'laguerre'|'lcm'|
    'leading'|'legendre'|'log'|'mod'|'multiply'|'not'|'nroots'|'number'|
    'numerator'|'operator'|'or'|'outer'|'pattern'|'patternsinfo'|'polar'|
    'power'|'prime'|'print'|'print2dascii'|'printcomputer'|'printlatex'|
    'printlist'|'printhuman'|'product'|'quote'|'quotient'|'rank'|'rationalize'|
    'real'|'rect'|'roots'|'round'|'equals'|'shape'|'sgn'|'silentpattern'|
    'simplify'|'sin'|'sinh'|'sqrt'|'stop'|'subst'|'sum'|'symbolsinfo'|'tan'|
    'tanh'|'taylor'|'test'|'testeq'|'testge'|'testgt'|'testle'|'testlt'|
    'transpose'|'unit'|'zero';

type Ux = U|number|string|BigInteger;

const $: typeof functions&{[key in builtInKeys]: (...args: Ux[]) => U; } =
    functions as any;

Array.from(builtin_fns).map(fn => ($[fn] = exec.bind(this, fn)));

export default $;
