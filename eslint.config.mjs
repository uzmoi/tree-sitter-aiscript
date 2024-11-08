import treesitter from 'eslint-config-treesitter';

export default [
  {ignores: ['*', '!grammar.js']},
  ...treesitter,
];
