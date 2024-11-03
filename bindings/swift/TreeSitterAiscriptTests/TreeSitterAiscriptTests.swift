import XCTest
import SwiftTreeSitter
import TreeSitterAiscript

final class TreeSitterAiscriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_aiscript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Aiscript grammar")
    }
}
