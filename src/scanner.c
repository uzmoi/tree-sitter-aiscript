#include "tree_sitter/parser.h"

// https://tree-sitter.github.io/tree-sitter/creating-parsers#external-scanners

enum TokenType {
    TEMPLATE_CONTENT,
};

void *tree_sitter_aiscript_external_scanner_create(void) {
    return NULL;
}

void tree_sitter_aiscript_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_aiscript_external_scanner_serialize(
    void *payload,
    char *buffer
) {
    return 0;
}

void tree_sitter_aiscript_external_scanner_deserialize(
    void *payload,
    const char *buffer,
    unsigned length
) {}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

static void mark_end(TSLexer *lexer) { lexer->mark_end(lexer); }

static bool scan_template_content(TSLexer *lexer) {
    lexer->result_symbol = TEMPLATE_CONTENT;
    for (bool has_content = false;; has_content = true) {
        mark_end(lexer);
        switch (lexer->lookahead) {
            case '\0':
                return false;
            case '`':
            case '{':
                return has_content;
            case '\\':
                advance(lexer);
                advance(lexer);
                break;
            default:
                advance(lexer);
        }
    }
}

bool tree_sitter_aiscript_external_scanner_scan(
    void *payload,
    TSLexer *lexer,
    const bool *valid_symbols
) {
    if (valid_symbols[TEMPLATE_CONTENT]) {
        return scan_template_content(lexer);
    }

    return false;
}
