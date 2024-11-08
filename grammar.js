/**
 * @file AiScript grammar for tree-sitter
 * @author uzmoi
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// https://github.com/aiscript-dev/aiscript/blob/master/src/parser/syntaxes/expressions.ts#L22
const PREC = {
  call: 20,
  prop: 18,
  pow: 17,
  prefix: 14,
  mul: 12,
  add: 10,
  cmp: 8,
  eq: 6,
  and: 4,
  or: 2,
};

module.exports = grammar({
  name: 'aiscript',

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._toplevel),

    _toplevel: $ => choice($.namespace, $.meta, $._statement),

    namespace: $ => seq(
      '::',
      field('name', $.identifier),
      '{',
      field('members', repeat(choice($._def_statement, $.namespace))),
      '}',
    ),

    meta: $ => seq(
      '###',
      field('name', optional($.identifier)),
      field('value', $._static_expression),
    ),


    _block_or_statement: $ => choice($.block, $._statement),

    block: $ => prec(1, seq('{', repeat($._statement), '}')),

    parameters: $ => seq('(', sepBy(',', $.parameter), ')'),

    parameter: $ => seq(
      field('dest', $._dest),
      field('optional', optional('?')),
      field('type', optional(seq(':', $._type))),
      field('default', optional(seq('=', $._expression))),
    ),

    _statement: $ => choice(
      $._def_statement,
      $.out_statement,
      $.return_statement,
      $.each_statement,
      $.for_statement,
      $.loop_statement,
      $.do_while_statement,
      $.while_statement,
      $.break_statement,
      $.continue_statement,
      $._expression,
    ),

    _def_statement: $ => choice($.var_def_statement, $.fn_def_statement),

    var_def_statement: $ => seq(
      field('keyword', choice('let', 'var')),
      field('dest', $._dest),
      field('type', optional(seq(':', $._type))),
      '=',
      field('init', $._expression),
    ),

    fn_def_statement: $ => seq(
      '@',
      field('name', $.identifier),
      field('params', $.parameters),
      field('ret_type', optional(seq(':', $._type))),
      field('body', $.block),
    ),

    out_statement: $ => seq('<:', $._expression),

    return_statement: $ => seq('return', $._expression),

    each_statement: $ => seq(
      'each',
      choice(
        seq('(', $._each_enumerator, ')'),
        $._each_enumerator,
      ),
      field('body', $._block_or_statement),
    ),

    _each_enumerator: $ => seq(
      'let',
      field('var', $._dest),
      ',',
      field('items', $._expression),
    ),

    for_statement: $ => seq(
      'for',
      choice(
        seq('(', $._for_enumerator, ')'),
        $._for_enumerator,
      ),
      field('body', $._block_or_statement),
    ),

    _for_enumerator: $ => prec.left(choice(
      seq(
        'let',
        field('var', $.identifier),
        optional(seq('=', field('from', $._expression))),
        ',',
        field('to', $._expression),
      ),
      field('times', $._expression),
    )),

    loop_statement: $ => seq('loop', $.block),

    do_while_statement: $ => seq(
      'do',
      field('body', $._block_or_statement),
      'while',
      field('cond', $._expression),
    ),

    while_statement: $ => seq(
      'while',
      field('cond', $._expression),
      field('body', $._block_or_statement),
    ),

    break_statement: _ => 'break',

    continue_statement: _ => 'continue',


    _expression: $ => choice(
      $.identifier,
      $._literal,
      $.array_expression,
      $.object_expression,
      $.binary_expression,
      $.if_expression,
      $.expression_with_parens,
    ),

    expression_with_parens: $ => seq('(', $._expression, ')'),

    _static_expression: $ => choice(
      $.null_literal,
      $.bool_literal,
      $.num_literal,
      $.str_literal,
      $.static_array_expression,
      $.static_object_expression,
    ),

    static_array_expression: $ => seq(
      '[',
      sepBy(',', $._static_expression),
      ']',
    ),

    static_object_expression: $ => seq(
      '{',
      sepBy(',', $.static_object_key_value),
      '}',
    ),

    static_object_key_value: $ => seq(
      field('key', $.identifier),
      ':',
      field('value', $._static_expression),
    ),

    _dest: $ => choice(
      $.identifier,
      $.array_dest,
      $.object_dest,
    ),

    array_dest: $ => seq(
      '[',
      sepBy(',', $._dest),
      ']',
    ),

    object_dest: $ => seq(
      '{',
      sepBy(',', $.object_dest_key_value),
      '}',
    ),

    object_dest_key_value: $ => seq(
      field('key', $.identifier),
      ':',
      field('value', $._dest),
    ),

    // https://github.com/aiscript-dev/aiscript/blob/master/src/parser/scanner.ts#L11
    identifier: _ => /[A-Za-z_][A-Za-z0-9_]*/,


    _literal: $ => choice(
      $.null_literal,
      $.bool_literal,
      $.num_literal,
      $.str_literal,
      $.template_literal,
    ),

    null_literal: _ => 'null',

    bool_literal: _ => choice('true', 'false'),

    // https://github.com/aiscript-dev/aiscript/blob/4ac255988cbe99775925d6d468302407f2c06e58/src/parser/scanner.ts#L415
    num_literal: _ => /\d+(?:\.\d+)?/,

    str_literal: _ => choice(
      /"(?:[^"\\]|\\.)*"/,
      /'(?:[^'\\]|\\.)*'/,
    ),

    // TODO: template_literal
    template_literal: _ => '``',

    array_expression: $ => seq('[', sepBy(',', $._expression), ']'),

    object_expression: $ => seq(
      '{',
      sepBy(',', $.object_key_value),
      '}',
    ),

    object_key_value: $ => seq(
      field('key', $.identifier),
      ':',
      field('value', $._expression),
    ),

    fn_expression: $ => seq(
      '@',
      field('params', $.parameters),
      field('ret_type', optional(seq(':', $._type))),
      field('body', $.block),
    ),


    binary_expression: $ => choice(
      .../** @type {const} */([
        [PREC.pow, '^', 'right'],
        [PREC.mul, choice('*', '/', '%')],
        [PREC.add, choice('+', '-')],
        [PREC.cmp, choice('<', '<=', '>', '>=')],
        [PREC.eq, choice('==', '!=')],
        [PREC.and, '&&'],
        [PREC.or, '||'],
      ]).map(([precedence, operator, associativity = /** @type {const} */('left')]) =>
        prec[associativity](precedence, seq(
          field('lhs', $._expression),
          field('operator', operator),
          field('rhs', $._expression),
        )),
      ),
    ),

    if_expression: $ => prec.right(seq(
      'if',
      field('cond', $._expression),
      field('then', $._block_or_statement),
      field('elif', repeat(seq('elif', $._expression, $._block_or_statement))),
      field('else', optional(seq('else', $._block_or_statement))),
    )),


    // TODO: _type
    _type: $ => $.identifier,
  },
});

/**
 * @param {RuleOrLiteral} sep
 * @param {RuleOrLiteral} rule
 */
function sepBy(sep, rule) {
  return seq(
    optional(seq(
      rule,
      repeat(seq(sep, rule)),
    )),
    optional(sep),
  );
}
