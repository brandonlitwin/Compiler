/* semanticsAnalyzer.ts
Brandon Litwin
CMPT 432 - Compilers
Project 3
*/

module TSC {
    export class SemanticsAnalyzer {
        static semantictext: string;
        static semanticErrorCount: number = 0;
        static ast;
        static scopeLevel: number = -1;
        static symbol: Object = {};
        static symbols: Array<Object> = [];
        public static analyze(ast) {
            this.ast = ast;
            console.log(ast);
            this.traverseTree(ast.root);
            return this.semantictext;

        }
        public static traverseTree(node) {
            if (node.value.includes("Block")) {
                this.scopeLevel++;
                for(var i = 0; i < node.children.length; i++){
                    this.traverseTree(node.children[i]);
                }
            } else if (node.value == "VarDecl") {
                this.symbol["type"] = node.children[0].value;
                this.symbol["name"] = node.children[1].value;
                this.symbol["scope"] = this.scopeLevel;
                this.symbol["lineNumber"] = node.children[1].lineNumber;
                this.symbol["index"] = node.children[1].index;

            }

        }
    }
}