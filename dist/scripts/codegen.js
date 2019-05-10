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
            this.staticVars = [];
            this.tempCounter = 0;
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
                this.codetext += "Generating OP codes for a variable declaration in scope " + this.scopeLevel + "\n";
                this.staticVar = {};
                this.addCode("8D");
                var tempVar = "T";
                tempVar += this.tempCounter.toString();
                this.addCode(tempVar);
                this.addCode("00");
                this.staticVar["Temp"] = tempVar + ",00";
                this.staticVar["Variable"] = node.children[1].value;
                this.staticVar["Address"] = this.tempCounter;
                this.tempCounter++;
                this.staticVars.push(this.staticVar);
            }
            else if (node.value == "AssignmentStatement") {
                this.codetext += "Generating OP codes for an assignment statement in scope " + this.scopeLevel + "\n";
                var variableAssigned = node.children[0].value;
                var valueAssigned = node.children[1].value;
                this.addCode("A9");
                this.addCode("0" + valueAssigned.toString());
                this.addCode("8D");
                // Find variable in list of static vars
                for (var i = 0; i < this.staticVars.length; i++) {
                    if (this.staticVars[i]["Variable"] == variableAssigned) {
                        this.addCode(this.staticVar["Temp"].split(',')[0]);
                        this.addCode(this.staticVar["Temp"].split(',')[1]);
                    }
                }
            }
            else if (node.value == "PrintStatement") {
                // Check for the printed var's type in symbol table, making sure it matches the current scope
                var variablePrinted = node.children[0].value;
                this.codetext += "Generating OP codes for a print statement in scope " + this.scopeLevel + "\n";
                this.addCode("AC");
                for (var i = 0; i < this.staticVars.length; i++) {
                    if (this.staticVars[i]["Variable"] == variablePrinted) {
                        this.addCode(this.staticVar["Temp"].split(',')[0]);
                        this.addCode(this.staticVar["Temp"].split(',')[1]);
                    }
                }
                this.addCode("A2");
                this.addCode("01");
                this.addCode("FF");
                this.addCode("00");
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
