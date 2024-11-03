package tree_sitter_aiscript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_aiscript "github.com/uzmoi/tree-sitter-aiscript/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_aiscript.Language())
	if language == nil {
		t.Errorf("Error loading Aiscript grammar")
	}
}
