// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterAiscript",
    products: [
        .library(name: "TreeSitterAiscript", targets: ["TreeSitterAiscript"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterAiscript",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                "src/scanner.c",
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterAiscriptTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterAiscript",
            ],
            path: "bindings/swift/TreeSitterAiscriptTests"
        )
    ],
    cLanguageStandard: .c11
)
