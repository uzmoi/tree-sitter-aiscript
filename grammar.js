/**
 * @file AiScript grammar for tree-sitter
 * @author uzmoi
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'aiscript',

  rules: {
    source_file: $ => repeat($._toplevel),

    _toplevel: $ => choice($.namespace, $.meta, $._statement),

    namespace: $ => seq(
      '::',
      field('name', $.identifier),
      '{',
      field('members', repeat(choice($.def_statement, $.namespace))),
      '}',
    ),

    meta: $ => seq(
      '###',
      field('name', optional($.identifier)),
      field('value', $._expression),
    ),


    _block_or_statement: $ => choice($.block, $._statement),

    block: $ => seq('{', repeat($._statement), '}'),

    _statement: $ => choice(
      $.def_statement,
      $.out_statement,
      $.return_statement,
      $.each_statement,
      $.for_statement,
      $.loop_statement,
      $.do_while_statement,
      $.while_statement,
      $.break_statement,
      $.continue_statement,
    ),

    // TODO: def_statement
    def_statement: $ => choice('let', 'var', '@'),

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

    _for_enumerator: $ => choice(
      seq(
        'let',
        field('var', $.identifier),
        optional(seq('=', field('from', $._expression))),
        ',',
        field('to', $._expression),
      ),
      field('times', $._expression),
    ),

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
    ),

    _dest: $ => choice(
      $.identifier,
    ),

    // TODO: identifier
    identifier: _ => '',
  },
});
