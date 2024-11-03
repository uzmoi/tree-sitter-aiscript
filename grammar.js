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
    // TODO: add the actual grammar rules
    source_file: $ => 'hello',
  },
});
