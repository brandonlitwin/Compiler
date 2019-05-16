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
            this.addCode("00");
            this.backpatch();
            while (this.codeCount < 256) {
                this.generatedCode += "00";
                this.generatedCode += " ";
                this.codeCount++;
            }
            //this.addCode("00");
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
                this.staticVar["Address"] = "";
                this.staticVar["Scope"] = this.scopeLevel;
                this.tempCounter++;
                this.staticVars.push(this.staticVar);
            }
            else if (node.value == "AssignmentStatement") {
                this.codetext += "Generating OP codes for an assignment statement in scope " + this.scopeLevel + "\n";
                var variableAssigned = node.children[0].value;
                var valueAssigned = node.children[1].value;
                var assigned = false;
                this.addCode("A9");
                this.addCode("0" + valueAssigned.toString());
                this.addCode("8D");
                // Find variable in list of static vars
                // Checks vars from innermost scope first
                for (var i = this.staticVars.length - 1; i >= 0; i--) {
                    if (this.staticVars[i]["Variable"] == variableAssigned && this.staticVars[i]["Scope"] <= this.scopeLevel && !assigned) {
                        this.addCode(this.staticVars[i]["Temp"].split(',')[0]);
                        this.addCode(this.staticVars[i]["Temp"].split(',')[1]);
                        assigned = true;
                    }
                }
            }
            else if (node.value == "PrintStatement") {
                // Check for the printed var's type in symbol table, making sure it matches the current scope or previous scope
                var variablePrinted = node.children[0].value;
                var printed = false;
                this.codetext += "Generating OP codes for a print statement in scope " + this.scopeLevel + "\n";
                this.addCode("AC");
                // Checks vars from innermost scope first
                for (var i = this.staticVars.length - 1; i >= 0; i--) {
                    if (this.staticVars[i]["Variable"] == variablePrinted && this.staticVars[i]["Scope"] <= this.scopeLevel && !printed) {
                        printed = true;
                        this.addCode(this.staticVars[i]["Temp"].split(',')[0]);
                        this.addCode(this.staticVars[i]["Temp"].split(',')[1]);
                    }
                }
                this.addCode("A2");
                this.addCode("01");
                this.addCode("FF");
            }
        };
        CodeGenerator.addCode = function (code) {
            this.generatedCode += code;
            this.generatedCode += " ";
            this.codetext += "Generating " + code + "\n";
            this.codeCount++;
        };
        CodeGenerator.backpatch = function () {
            for (var i = 0; i < this.staticVars.length; i++) {
                // Convert all temp addresses to memory locations
                if (this.staticVars[i]["Address"] == "") {
                    var codeToHex = this.codeCount.toString(16).toUpperCase();
                    if (codeToHex.length == 1) {
                        this.staticVars[i]["Address"] = "0" + codeToHex;
                    }
                    else {
                        this.staticVars[i]["Address"] = codeToHex;
                    }
                    this.codeCount++;
                }
            }
            for (var i = 0; i < this.generatedCode.length; i++) {
                // Replace each temp address in the code
                if (this.generatedCode[i] == "T") {
                    for (var j = 0; j < this.staticVars.length; j++) {
                        var currentCode = this.generatedCode[i] + this.generatedCode[i + 1];
                        if (this.staticVars[j]["Temp"].split(',')[0] == currentCode) {
                            var convertedCode = this.staticVars[j]["Address"];
                            this.generatedCode = this.generatedCode.replace(currentCode, convertedCode);
                        }
                    }
                }
            }
        };
        CodeGenerator.scopeLevel = -1;
        CodeGenerator.codegenErrorCount = 0;
        CodeGenerator.tempCounter = 0;
        CodeGenerator.staticVar = {};
        CodeGenerator.staticVars = [];
        CodeGenerator.codeCount = 0;
        return CodeGenerator;
    }());
    TSC.CodeGenerator = CodeGenerator;
})(TSC || (TSC = {}));
