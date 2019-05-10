/* codegen.ts
Brandon Litwin
CMPT 432 - Compilers
Project 4
*/
var TSC;
(function (TSC) {
    var CodeGenerator = /** @class */ (function () {
        function CodeGenerator() {
        }
        CodeGenerator.generate = function (ast, symbols) {
            this.generatedCode = "";
            errorText = "";
            warningText = "";
            this.codetext = "Generating code for program " + programCount + "...\n";
            this.addCode("A9");
            this.addCode("00");
            this.traverseTree(ast.root);
            return [this.generatedCode, this.codetext];
        };
        CodeGenerator.traverseTree = function (node) {
            if (node.value.includes("Block")) {
                this.scopeLevel++;
                for (var i = 0; i < node.children.length; i++) {
                    if (this.codegenErrorCount == 0) {
                        this.traverseTree(node.children[i]);
                    }
                }
                this.scopeLevel--;
                return;
            }
            else if (node.value == "VarDecl") {
                this.staticVar = {};
                this.addCode("8D");
                var tempVar = "T";
                tempVar += this.tempCounter.toString();
                this.addCode(tempVar);
                this.addCode("XX");
                this.staticVar["Temp"] = tempVar + "XX";
                this.staticVar["Variable"] = node.children[1].value;
                this.staticVar["Address"] = this.tempCounter;
                this.tempCounter++;
                this.staticVars.push(this.staticVar);
            }
            else if (node.value == "AssignmentStatement") {
                var variableAssigned = node.children[0].value;
            }
            else if (node.value == "PrintStatement") {
                // Check for the printed var's type in symbol table, making sure it matches the current scope
            }
        };
        CodeGenerator.addCode = function (code) {
            this.generatedCode += code;
            this.generatedCode += " ";
            this.codetext += "Generating " + code + "\n";
        };
        CodeGenerator.scopeLevel = -1;
        CodeGenerator.codegenErrorCount = 0;
        CodeGenerator.tempCounter = 0;
        CodeGenerator.staticVar = {};
        CodeGenerator.staticVars = [];
        return CodeGenerator;
    }());
    TSC.CodeGenerator = CodeGenerator;
})(TSC || (TSC = {}));
