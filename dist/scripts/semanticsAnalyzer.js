/* semanticsAnalyzer.ts
Brandon Litwin
CMPT 432 - Compilers
Project 3
*/
var TSC;
(function (TSC) {
    var SemanticsAnalyzer = /** @class */ (function () {
        function SemanticsAnalyzer() {
        }
        SemanticsAnalyzer.analyze = function (ast) {
            this.ast = ast;
            console.log(ast);
            this.traverseTree(ast.root);
            return this.semantictext;
        };
        SemanticsAnalyzer.traverseTree = function (node) {
            if (node.value.includes("Block")) {
                this.scopeLevel++;
                for (var i = 0; i < node.children.length; i++) {
                    this.traverseTree(node.children[i]);
                }
            }
            else if (node.value == "VarDecl") {
                this.symbol["type"] = node.children[0].value;
                this.symbol["name"] = node.children[1].value;
                this.symbol["scope"] = this.scopeLevel;
                this.symbol["lineNumber"] = node.children[1].lineNumber;
                this.symbol["index"] = node.children[1].index;
            }
        };
        SemanticsAnalyzer.semanticErrorCount = 0;
        SemanticsAnalyzer.scopeLevel = -1;
        SemanticsAnalyzer.symbol = {};
        SemanticsAnalyzer.symbols = [];
        return SemanticsAnalyzer;
    }());
    TSC.SemanticsAnalyzer = SemanticsAnalyzer;
})(TSC || (TSC = {}));
