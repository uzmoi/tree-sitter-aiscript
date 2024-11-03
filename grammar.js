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

    _statement: $ => choice(
      $.def_statement,
    ),

    // TODO: def_statement
    def_statement: $ => choice('let', 'var', '@'),

    _expression: $ => choice(
      $.identifier,
    ),

    // TODO: identifier
    identifier: _ => '',
  },
});
