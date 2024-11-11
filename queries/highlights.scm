
; Identifiers

(identifier) @variable
((identifier) @constant
  (#match? @constant "^[A-Z\\d_]+$"))

(prop_expression name: (identifier) @property)

(_type) @type

; Namespace

(namespace name: (identifier) @namespace)
(reference namespace: (identifier) @namespace)
(reference namespace: (reference member: (identifier) @namespace))

; Functions

(fn_def_statement name: (identifier) @function)
(call_expression callee: (identifier) @function)
(call_expression callee: (reference member: (identifier) @function))
(call_expression callee: (prop_expression name: (identifier) @function.method))

; Literals

(null_literal) @constant.builtin
(bool_literal) @constant.builtin

(num_literal) @number

(str_literal) @string
(template_content) @string
(template_literal "`" @string)

; Comments

(line_comment) @comment
(block_comment) @comment

; Operators

[
  "!"
  "!="
  "###"
  "%"
  "&&"
  "*"
  "+"
  "+="
  "-"
  "-="
  "/"
  ":"
  "::"
  "<"
  "<:"
  "<="
  "="
  "=="
  ">"
  ">="
  "?"
  "@"
  "^"
  "||"
] @operator

; Punctuation

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  "."
] @punctuation.delimiter

; Keyword

[
  "do"
  "each"
  "elif"
  "else"
  "eval"
  "exists"
  "for"
  "if"
  "let"
  "loop"
  "return"
  "var"
  "while"
  (break_statement)
  (continue_statement)
] @keyword
